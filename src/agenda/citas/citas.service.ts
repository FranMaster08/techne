// src/agenda/citas.service.ts
import {
    Injectable, ConflictException, InternalServerErrorException, BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import { CrearCitaDto } from '../dto/crear-cita.dto';
import { ListarCitasQueryDto } from '../dto/listar-citas-query.dto';
import { Cita } from '../entities/cita.entity';
import { Prestador } from '../entities/prestador.entity';



@Injectable()
export class CitasService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Cita) private citaRepo: Repository<Cita>,
        @InjectRepository(Prestador) private prestRepo: Repository<Prestador>,
        @InjectPinoLogger(CitasService.name) private logger: PinoLogger,
    ) { }

    private trace() { return randomUUID(); }

    /** Deriva un bigint (64-bit) a partir del UUID para advisory lock */
    private lockKey(uuid: string): bigint {
        return BigInt('0x' + uuid.replace(/-/g, '').slice(0, 16));
    }

    async crear(dto: CrearCitaDto) {
        const traceId = this.trace();
        this.logger.info({ traceId, prestadorId: dto.prestadorId, inicio: dto.inicio }, 'Crear cita: intento');

        try {
            const prestador = await this.prestRepo.findOneByOrFail({ id: dto.prestadorId });
            if (dto.duracionMinutos % prestador.duracionBloqueMin !== 0) {
                throw new BadRequestException({ message: 'Duración no válida', traceId });
            }

            const inicio = DateTime.fromISO(dto.inicio).toUTC();
            const fin = inicio.plus({ minutes: dto.duracionMinutos }).toUTC();

            return await this.dataSource.transaction(async (trx) => {
                await trx.query('SELECT pg_advisory_xact_lock($1)', [this.lockKey(dto.prestadorId)]);

                // Verificar que cae dentro del horario del día (reglas/esp. pueden agregarse aquí si deseas segunda validación)
                // — En este MVP asumimos que el front pidió disponibilidad primero.

                // Chequeo de solape
                const conflict = await trx.getRepository(Cita).createQueryBuilder('c')
                    .where('c.prestador_id = :pid', { pid: dto.prestadorId })
                    .andWhere("c.estado = 'RESERVADA'")
                    .andWhere('NOT (c.fin_utc <= :ini OR c.inicio_utc >= :fin)', { ini: inicio.toJSDate(), fin: fin.toJSDate() })
                    .getExists();

                if (conflict) {
                    this.logger.warn({ traceId }, 'Crear cita: conflicto (ocupado)');
                    throw new ConflictException({ message: 'Horario no disponible', traceId });
                }

                const nueva = trx.getRepository(Cita).create({
                    prestadorId: dto.prestadorId,
                    inicioUtc: inicio.toJSDate(),
                    finUtc: fin.toJSDate(),
                    nombreCliente: dto.nombreCliente,
                    emailCliente: dto.emailCliente,
                    telefonoCliente: dto.telefonoCliente,
                    estado: 'RESERVADA',
                });

                const saved = await trx.getRepository(Cita).save(nueva);
                this.logger.info({ traceId, citaId: saved.id }, 'Crear cita: ok');
                return saved;
            });
        } catch (err: any) {
            if (err?.getStatus) throw err;
            this.logger.error({ traceId, err }, 'Crear cita: error');
            throw new InternalServerErrorException({ message: 'Error al crear cita', traceId });
        }
    }

    async listar(q: ListarCitasQueryDto) {
        const traceId = this.trace();
        this.logger.debug({ traceId, q }, 'Listar citas: inicio');
        try {
            const qb = this.citaRepo.createQueryBuilder('c')
                .where('c.prestador_id = :pid', { pid: q.prestadorId })
                .andWhere("c.estado = 'RESERVADA'")
                .orderBy('c.inicio_utc', 'ASC');

            if (q.fecha) {
                qb.andWhere('c.inicio_utc::date = :f', { f: q.fecha });
            } else if (q.desde && q.hasta) {
                const prest = await this.prestRepo.findOneByOrFail({ id: q.prestadorId });
                const desdeUtc = DateTime.fromISO(q.desde, { zone: prest.zonaHoraria }).startOf('day').toUTC().toISO();
                const hastaUtc = DateTime.fromISO(q.hasta, { zone: prest.zonaHoraria }).endOf('day').toUTC().toISO();
                qb.andWhere('c.inicio_utc BETWEEN :d AND :h', { d: desdeUtc, h: hastaUtc });
            }

            const data = await qb.getMany();
            this.logger.info({ traceId, count: data.length }, 'Listar citas: ok');
            return data;
        } catch (err: any) {
            this.logger.error({ traceId, err }, 'Listar citas: error');
            throw new InternalServerErrorException({ message: 'Error al listar citas', traceId });
        }
    }
}
