import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SuccessModal } from '../ui/SuccessModal';
import { eventsApi } from '../../api/events.api';
import { gamesApi } from '../../api/games.api';
import { useAuthStore } from '../../store/auth.store';
import type { EventDto, Game } from '../../types';

interface EventFormModalProps {
    open: boolean
    onClose: () => void
    onSave: () => void
    event?: EventDto | null
}

export function EventFormModal({ open, onClose, onSave, event }: EventFormModalProps) {
    const [title, setTitle] = useState('')
    const [gameName, setGameName] = useState('')
    const [games, setGames] = useState<Game[]>([])
    const [selectedGameId, setSelectedGameId] = useState<string>('')
    const [useLibraryGame, setUseLibraryGame] = useState(false)
    const [minPlayers, setMinPlayers] = useState('')
    const [maxPlayers, setMaxPlayers] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const authUser = useAuthStore((state) => state.user)

    useEffect(() => {
        if (open) {
            gamesApi.getAll({ limit: 100 }).then((res) => setGames(res.data))
            if (event) {
                setUseLibraryGame(!!event.gameId)
                setSelectedGameId(event.gameId?.toString() ?? '')
                setTitle(event.title)
                setGameName(event.gameName ?? '')
                setMinPlayers(event.minPlayers.toString())
                setMaxPlayers(event.maxPlayers.toString())
                setDateTime(new Date(event.dateTime).toISOString().slice(0, 16))
                setDescription(event.description ?? '')
            } else {
                setUseLibraryGame(false)
                setSelectedGameId('')
                setTitle('')
                setGameName('')
                setMinPlayers('')
                setMaxPlayers('')
                setDateTime('')
                setDescription('')
            }
            setError('')
            setSuccess(false)
        }
    }, [open, event])

    function handleClose() {
        setSuccess(false)
        onClose()
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!authUser) return
        setError('')
        setLoading(true)

        const data = {
            userId: authUser.id,
            title,
            gameId: useLibraryGame && selectedGameId ? +selectedGameId : undefined,
            gameName: !useLibraryGame && gameName ? gameName : undefined,
            minPlayers: +minPlayers,
            maxPlayers: +maxPlayers,
            dateTime: new Date(dateTime).toISOString(),
            description: description || undefined,
        }

        try {
            if (event) {
                await eventsApi.update({ id: event.id, ...data })
            } else {
                await eventsApi.create(data)
            }
            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Error al guardar el evento.')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        fontSize: '0.9rem',
        outline: 'none',
        fontFamily: 'inherit',
    }

    const labelStyle: React.CSSProperties = {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        marginBottom: '4px',
        display: 'block',
        fontWeight: 600,
    }

    return (
        <>
            <Modal open={open && !success} onClose={handleClose} title={event ? 'Editar evento' : 'Nuevo evento'} width={520}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}>Título</label>
                        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Juego</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', cursor: 'pointer' }}>
                                    <input type="radio" checked={!useLibraryGame} onChange={() => { setUseLibraryGame(false); setSelectedGameId('') }} />
                                    Juego externo
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', cursor: 'pointer' }}>
                                    <input type="radio" checked={useLibraryGame} onChange={() => { setUseLibraryGame(true); setGameName('') }} />
                                    De la biblioteca
                                </label>
                            </div>
                            {useLibraryGame ? (
                                <select style={inputStyle} value={selectedGameId} onChange={(e) => setSelectedGameId(e.target.value)}>
                                    <option value="">Seleccionar juego...</option>
                                    {games.map((g) => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input style={inputStyle} value={gameName} onChange={(e) => setGameName(e.target.value)} placeholder="Nombre del juego..." />
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>Mín. jugadores</label>
                            <input style={inputStyle} type="number" min="1" value={minPlayers} onChange={(e) => setMinPlayers(e.target.value)} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Máx. jugadores</label>
                            <input style={inputStyle} type="number" min="1" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Fecha y hora</label>
                        <input style={inputStyle} type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Descripción (opcional)</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>{error}</p>}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button variant="secondary" type="button" onClick={handleClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <SuccessModal
                open={success}
                onClose={() => { onSave(); handleClose() }}
                title={event ? '¡Evento actualizado correctamente!' : '¡Evento creado correctamente!'}
                message={event
                    ? `Los datos de "${title}" han sido actualizados.`
                    : `"${title}" ha sido creado. ¡Ya puedes apuntarte!`
                }
            />
        </>
    )
}