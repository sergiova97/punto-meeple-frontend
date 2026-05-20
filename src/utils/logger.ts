import apiClient from "../api/client.ts";

interface LogPayload {
    level: 'info' | 'warn' | 'error'
    message: string
    context?: string
    details?: string
}

async function send(payload: LogPayload) {
    try {
        await apiClient.post('/logs', payload)
    } catch {}
}

export const logger = {
    info: (message: string, context?: string, details?: string) =>
        send({ level: 'info', message, context, details }),

    warn: (message: string, context?: string, details?: string) =>
        send({ level: 'warn', message, context, details }),

    error: (message: string, context?: string, details?: string) =>
        send({ level: 'error', message, context, details }),
}