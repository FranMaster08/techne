// src/agenda/disponibilidad.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { DateTime, Interval } from 'luxon';
import { buildVentanasDelDia, partirEnBloques, restarOcupados, toISO } from 'src/shared/utils/time/tiempo.util';
import { DisponibilidadQueryDto } from '../dto/disponibilidad-query.dto';
import { Cita } from '../entities/cita.entity';
import { HorarioEspecial } from '../entities/horario-especial.entity';
import { HorarioSemanal } from '../entities/horario-semanal.entity';
import { Prestador } from '../entities/prestador.entity';



@Injectable()
export class DisponibilidadService {
    constructor(
        @InjectRepository(Prestador) private prestRepo: Repository<Prestador>,
        @InjectRepository(HorarioSemanal) private hsRepo: Repository<HorarioSemanal>,
        @InjectRepository(HorarioEspecial) private heRepo: Repository<HorarioEspecial>,
        @InjectRepository(Cita) private citaRepo: Repository<Cita>,
        @InjectPinoLogger(DisponibilidadService.name) private logger: PinoLogger,
    ) { }

    private trace() { return randomUUID(); }

    async consultar(q: DisponibilidadQueryDto) {
        const traceId = this.trace();
        this.logger.info({ traceId, q }, 'Disponibilidad: inicio');

        try {
            const prestador = await this.prestRepo.findOneByOrFail({ id: q.prestadorId });
            const zona = prestador.zonaHoraria;
            const slotMin = prestador.duracionBloqueMin;

            // Rango en UTC para traer citas
            const desdeUtc = DateTime.fromISO(q.desde, { zone: zona }).startOf('day').toUTC().toJSDate();
            const hastaUtc = DateTime.fromISO(q.hasta, { zone: zona }).endOf('day').toUTC().toJSDate();

            // Traer horarios semanales del prestador
            const horarios = await this.hsRepo.find({ where: { prestadorId: prestador.id } });

            // Traer especiales del rango
            const especiales = await this.heRepo.createQueryBuilder('e')
                .where('e.prestador_id = :pid', { pid: prestador.id })
                .andWhere('e.fecha BETWEEN :d AND :h', { d: q.desde, h: q.hasta })
                .getMany();
            const mapEspecial = new Map(especiales.map(e => [e.fecha, e]));

            // Traer citas ocupadas
            const citas = await this.citaRepo.find({
                where: {
                    prestadorId: prestador.id,
                    inicioUtc: Between(desdeUtc, hastaUtc),
                },
                order: { inicioUtc: 'ASC' },
            });
            const ocupados = citas
                .filter(c => c.estado === 'RESERVADA')
                .map(c => Interval.fromDateTimes(DateTime.fromJSDate(c.inicioUtc), DateTime.fromJSDate(c.finUtc)));

            // Construir resultado día a día
            const days: any[] = [];
            let totalPuestos = 0;
            const limite = q.limite ?? Number.MAX_SAFE_INTEGER;
            const desdeCorte = q.desdeHora ? DateTime.fromISO(q.desdeHora).toUTC() : null;

            for (
                let cursor = DateTime.fromISO(q.desde, { zone: zona });
                cursor <= DateTime.fromISO(q.hasta, { zone: zona });
                cursor = cursor.plus({ days: 1 })
            ) {
                const fechaStr = cursor.toISODate();
                const dow = cursor.weekday % 7; // Luxon: 1..7 (1=lunes). Convertimos a 0..6
                const dow0a6 = dow === 7 ? 0 : dow;

                const horariosDia = horarios.filter(h => h.diaSemana === dow0a6);
                const especial = mapEspecial.get(fechaStr) ?? null;

                const ventanas = buildVentanasDelDia(fechaStr!, zona, horariosDia, especial); // Interval[] en UTC

                // Partir en bloques por cada ventana
                let slots: Interval[] = [];
                for (const v of ventanas) {
                    const corte = (desdeCorte && cursor.hasSame(DateTime.fromISO(q.desde, { zone: zona }), 'day')) ? desdeCorte : undefined;
                    slots = slots.concat(partirEnBloques(v, slotMin, corte));
                }

                // Restar ocupados
                const libres = restarOcupados(slots, ocupados);

                if (libres.length > 0) {
                    const acumulado = [];
                    for (const s of libres) {
                        if (totalPuestos >= limite) break;
                        acumulado.push(toISO(s));
                        totalPuestos++;
                    }
                    if (acumulado.length > 0) {
                        days.push({ fecha: fechaStr, horariosLibres: acumulado });
                    }
                }

                if (totalPuestos >= limite) break;
            }

            this.logger.info({ traceId, dias: days.length, totalPuestos }, 'Disponibilidad: ok');
            return { prestadorId: prestador.id, dias: days };
        } catch (err: any) {
            this.logger.error({ traceId, err }, 'Disponibilidad: error');
            throw new InternalServerErrorException({ message: 'Error al consultar disponibilidad', traceId });
        }
    }
}
