// src/agenda/utils/tiempo.util.ts
import { DateTime, Interval } from 'luxon';
import { HorarioEspecial } from 'src/agenda/entities/horario-especial.entity';
import { HorarioSemanal } from 'src/agenda/entities/horario-semanal.entity';


export function buildVentanasDelDia(
    fechaISO: string, // YYYY-MM-DD (local del prestador)
    zona: string,
    horariosDia: HorarioSemanal[], // todas las filas de ese dow
    especial?: HorarioEspecial | null,
): Interval[] {
    const fecha = DateTime.fromISO(fechaISO, { zone: zona });
    if (especial?.cerrado) return [];

    const ventanas: Interval[] = [];

    if (especial?.inicioEspecial && especial?.finEspecial) {
        const ini = fecha.set(parseTime(especial.inicioEspecial)).toUTC();
        const fin = fecha.set(parseTime(especial.finEspecial)).toUTC();
        if (fin > ini) ventanas.push(Interval.fromDateTimes(ini, fin));
        return ventanas;
    }

    for (const h of horariosDia) {
        const ini = fecha.set(parseTime(h.horaInicio)).toUTC();
        const fin = fecha.set(parseTime(h.horaFin)).toUTC();
        if (fin > ini) ventanas.push(Interval.fromDateTimes(ini, fin));
    }
    return ventanas;
}

export function partirEnBloques(ventana: Interval, minutos: number, corteDesde?: DateTime): Interval[] {
    const out: Interval[] = [];
    let cursor = ventana.start;
    if (corteDesde && corteDesde > cursor) {
        cursor = DateTime.max(cursor, corteDesde);
    }
    while (cursor < ventana.end) {
        const fin = cursor.plus({ minutes: minutos });
        if (fin > ventana.end) break;
        out.push(Interval.fromDateTimes(cursor, fin));
        cursor = fin;
    }
    return out;
}

export function restarOcupados(free: Interval[], ocupados: Interval[]): Interval[] {
    return free.filter(slot => !ocupados.some(b => b.overlaps(slot)));
}

export function parseTime(hhmmss: string): { hour: number; minute: number; second: number } {
    const [h, m, s] = hhmmss.split(':').map(Number);
    return { hour: h, minute: m ?? 0, second: s ?? 0 };
}

export function toISO(i: Interval) {
    return { inicio: i.start.toUTC().toISO(), fin: i.end.toUTC().toISO() };
}
