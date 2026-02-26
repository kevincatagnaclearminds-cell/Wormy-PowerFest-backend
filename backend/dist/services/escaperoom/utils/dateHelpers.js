"use strict";
/**
 * Utilidades para manejo consistente de fechas en zona horaria de Ecuador (UTC-5)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = parseDate;
exports.getEcuadorTime = getEcuadorTime;
exports.getEcuadorHour = getEcuadorHour;
exports.getEcuadorTimeComponents = getEcuadorTimeComponents;
exports.isSameDay = isSameDay;
exports.getEcuadorDate = getEcuadorDate;
exports.formatDateES = formatDateES;
/**
 * Convierte una fecha string (YYYY-MM-DD) a Date en mediodía UTC
 * Esto evita problemas de cambio de día por zona horaria
 */
function parseDate(dateStr) {
    return new Date(dateStr + 'T12:00:00.000Z');
}
/**
 * Obtiene la fecha y hora actual para guardar en la base de datos
 * Devuelve la hora actual del servidor (que se guardará en UTC en PostgreSQL)
 */
function getEcuadorTime() {
    return new Date();
}
/**
 * Obtiene la hora actual en Ecuador (0-23)
 * Útil para validaciones de horario
 */
function getEcuadorHour() {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Guayaquil',
        hour: '2-digit',
        hour12: false,
    });
    const hourStr = formatter.format(new Date());
    return parseInt(hourStr);
}
/**
 * Obtiene la hora y minutos actuales en Ecuador
 * Útil para asignar turnos según la hora actual
 */
function getEcuadorTimeComponents() {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Guayaquil',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const get = (type) => parts.find(p => p.type === type)?.value || '0';
    return {
        hour: parseInt(get('hour')),
        minute: parseInt(get('minute')),
    };
}
/**
 * Compara si dos fechas son el mismo día (ignorando hora)
 * Usa UTC para evitar problemas de zona horaria
 */
function isSameDay(date1, date2) {
    return (date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate());
}
/**
 * Obtiene la fecha actual en Ecuador como objeto (año, mes, día)
 */
function getEcuadorDate() {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Guayaquil',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const parts = formatter.formatToParts(new Date());
    const get = (type) => parts.find(p => p.type === type)?.value || '0';
    return {
        year: parseInt(get('year')),
        month: parseInt(get('month')) - 1, // JavaScript months are 0-indexed
        day: parseInt(get('day')),
    };
}
/**
 * Formatea una fecha para mostrar en formato español
 */
function formatDateES(date) {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
    });
}
