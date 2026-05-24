import { useEffect, useState } from 'react';
import { eventsApi } from '../../api/events.api';
import { Table } from '../ui/Table';
import { Pagination } from '../ui/Pagination';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EventDetailModal } from './EventDetailModal';
import { EventFormModal } from './EventFormModal';
import { useAuthStore } from '../../store/auth.store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { EventDto, EventStatus } from '../../types';

const STATUS_BADGE: Record<EventStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    OPEN:      { label: 'Abierto',    variant: 'success' },
    FULL:      { label: 'Completo',   variant: 'warning' },
    CANCELLED: { label: 'Cancelado',  variant: 'danger' },
    FINISHED:  { label: 'Finalizado', variant: 'neutral' },
}

interface EventsTableProps {
    onlyMine?: boolean
    initialDateFrom?: string
    initialDateTo?: string
}

export function EventsTable({ onlyMine = false, initialDateTo, initialDateFrom }: EventsTableProps) {
    const [events, setEvents] = useState<EventDto[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [filterTitle, setFilterTitle] = useState('')
    const [filterDateFrom, setFilterDateFrom] = useState(initialDateFrom ?? '')
    const [filterDateTo, setFilterDateTo] = useState(initialDateTo ?? '')
    const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [editEvent, setEditEvent] = useState<EventDto | null>(null)
    const limit = 10

    const authUser = useAuthStore((state) => state.user)

    function loadEvents() {
        eventsApi.getAll({
            title: filterTitle || undefined,
            creatorId: onlyMine ? authUser?.id : undefined,
            dateFrom: filterDateFrom || undefined,
            dateTo: filterDateTo || undefined,
            page,
            limit,
        }).then((res) => {
            setEvents(res.data)
            setTotal(res.total)
        })
    }

    useEffect(() => {
        loadEvents()
    }, [page, filterTitle, onlyMine, filterDateFrom, filterDateTo, initialDateFrom, initialDateTo])

    async function handleJoin(event: EventDto) {
        if (!authUser) return
        await eventsApi.join(event.id, authUser.id)
        loadEvents()
    }

    async function handleLeave(event: EventDto) {
        if (!authUser) return
        await eventsApi.leave(event.id, authUser.id)
        loadEvents()
    }

    async function handleDelete(event: EventDto) {
        if (!authUser) return
        if (!window.confirm('¿Seguro que quieres eliminar este evento?')) return
        await eventsApi.delete(event.id, authUser.id)
        loadEvents()
    }

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        fontSize: '0.875rem',
        outline: 'none',
    }

    const columns = [
        { label: 'Título', render: (e: EventDto) => e.title },
        { label: 'Juego', render: (e: EventDto) => e.gameName ?? '—' },
        {
            label: 'Fecha y hora',
            render: (e: EventDto) => new Date(e.dateTime).toLocaleString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            }),
        },
        { label: 'Creador', render: (e: EventDto) => e.creatorName },
        { label: 'Jugadores', render: (e: EventDto) => `${e.participantCount} / ${e.maxPlayers}` },
        {
            label: 'Estado',
            render: (e: EventDto) => {
                const { label, variant } = STATUS_BADGE[e.status]
                return <Badge variant={variant}>{label}</Badge>
            },
        },
        {
            label: 'Acciones',
            render: (e: EventDto) => {
                const isCreator = e.creatorId === authUser?.id
                const isParticipant = e.participants.some((p) => p.id === authUser?.id)

                return (
                    <div style={{ display: 'flex', gap: '8px' }} onClick={(ev) => ev.stopPropagation()}>
                        {isCreator ? (
                            <>
                                <button
                                    onClick={() => { setEditEvent(e); setFormOpen(true) }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '4px' }}
                                >
                                    <FontAwesomeIcon icon={faPencil} />
                                </button>
                                <button
                                    onClick={() => handleDelete(e)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', padding: '4px' }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </>
                        ) : isParticipant ? (
                            <button
                                onClick={() => handleLeave(e)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-error)', fontWeight: 600 }}
                            >
                                Desapuntarse
                            </button>
                        ) : (
                            <button
                                onClick={() => handleJoin(e)}
                                disabled={e.status === 'FULL' || e.status === 'CANCELLED'}
                                style={{
                                    background: 'none', border: 'none', cursor: e.status === 'FULL' ? 'not-allowed' : 'pointer',
                                    fontSize: '0.75rem', color: e.status === 'FULL' ? 'var(--text-secondary)' : 'var(--color-primary)',
                                    fontWeight: 600, opacity: e.status === 'FULL' ? 0.5 : 1,
                                }}
                            >
                                Apuntarse
                            </button>
                        )}
                    </div>
                )
            },
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
                    <input
                        style={inputStyle}
                        placeholder="Buscar por título..."
                        value={filterTitle}
                        onChange={(e) => setFilterTitle(e.target.value)}
                        onBlur={() => setPage(1)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); loadEvents() } }}
                    />
                    <input
                        style={inputStyle}
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1) }}
                    />
                    <input
                        style={inputStyle}
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => { setFilterDateTo(e.target.value); setPage(1) }}
                    />
                </div>
                {onlyMine && (
                    <Button variant="primary" onClick={() => { setEditEvent(null); setFormOpen(true) }}>
                        Nuevo evento
                    </Button>
                )}
            </div>

            <Table
                columns={columns}
                data={events}
                keyExtractor={(e) => e.id}
                onRowClick={(e) => { setSelectedEvent(e); setDetailOpen(true) }}
            />

            <Pagination
                page={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={setPage}
            />

            <EventDetailModal
                event={selectedEvent}
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
            />

            <EventFormModal
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditEvent(null) }}
                onSave={() => { loadEvents(); setFormOpen(false); setEditEvent(null) }}
                event={editEvent}
            />
        </div>
    )
}