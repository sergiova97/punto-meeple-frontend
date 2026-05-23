import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import type { EventDto, EventStatus } from '../../types';

interface EventDetailModalProps {
    event: EventDto | null
    open: boolean
    onClose: () => void
}

const STATUS_BADGE: Record<EventStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    OPEN:      { label: 'Abierto',    variant: 'success' },
    FULL:      { label: 'Completo',   variant: 'warning' },
    CANCELLED: { label: 'Cancelado',  variant: 'danger' },
    FINISHED:  { label: 'Finalizado', variant: 'neutral' },
}

export function EventDetailModal({ event, open, onClose }: EventDetailModalProps) {
    if (!event) return null

    const { label, variant } = STATUS_BADGE[event.status]

    return (
        <Modal open={open} onClose={onClose} title={event.title} width={520}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Juego</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{event.gameName ?? '—'}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha y hora</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>
                            {new Date(event.dateTime).toLocaleString('es-ES', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Creador</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{event.creatorName}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Estado</span>
                        <div style={{ marginTop: '4px' }}>
                            <Badge variant={variant}>{label}</Badge>
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Jugadores</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>
                            {event.participantCount} / {event.maxPlayers} (mín. {event.minPlayers})
                        </p>
                    </div>
                </div>

                {event.description && (
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Descripción</span>
                        <p style={{ marginTop: '4px', fontSize: '0.875rem', lineHeight: 1.6 }}>{event.description}</p>
                    </div>
                )}

                <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                        Participantes
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {event.participants.map((p) => (
                            <span key={p.id} style={{
                                padding: '4px 10px',
                                borderRadius: '99px',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                background: 'var(--color-secondary)',
                                color: 'var(--color-primary)',
                            }}>
                                {p.surname}, {p.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}