import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { gamesApi } from '../../api/games.api'
import { gameCategoriesApi } from '../../api/game-categories.api'
import { gameMechanicsApi } from '../../api/game-mechanics.api'
import type { Game, GameCategory, GameMechanic, GameType } from '../../types'

interface GameCreateModalProps {
    open: boolean
    onClose: () => void
    onSave: () => void
    game?: Game | null
    defaultType: GameType
}

export function GameCreateModal({ open, onClose, onSave, game, defaultType }: GameCreateModalProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [duration, setDuration] = useState('')
    const [minPlayers, setMinPlayers] = useState('')
    const [maxPlayers, setMaxPlayers] = useState('')
    const [publisher, setPublisher] = useState('')
    const [categoryIds, setCategoryIds] = useState<number[]>([])
    const [mechanicIds, setMechanicIds] = useState<number[]>([])
    const [categories, setCategories] = useState<GameCategory[]>([])
    const [mechanics, setMechanics] = useState<GameMechanic[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (open) {
            gameCategoriesApi.getAll().then(setCategories)
            gameMechanicsApi.getAll().then(setMechanics)

            if (game) {
                setName(game.name)
                setDescription(game.description)
                setDuration(game.duration?.toString() ?? '')
                setMinPlayers(game.minPlayers?.toString() ?? '')
                setMaxPlayers(game.maxPlayers?.toString() ?? '')
                setPublisher(game.publisher)
                setCategoryIds(game.categories.map((c) => c.id))
                setMechanicIds(game.mechanics.map((m) => m.id))
            } else {
                setName('')
                setDescription('')
                setDuration('')
                setMinPlayers('')
                setMaxPlayers('')
                setPublisher('')
                setCategoryIds([])
                setMechanicIds([])
            }
        }
    }, [open, game])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = {
                name,
                description,
                duration: duration ? +duration : undefined,
                minPlayers: minPlayers ? +minPlayers : undefined,
                maxPlayers: maxPlayers ? +maxPlayers : undefined,
                publisher,
                type: defaultType,
                categoryIds,
                mechanicIds,
            }

            if (game) {
                await gamesApi.update({ id: game.id, ...data })
            } else {
                await gamesApi.create(data)
            }

            onSave()
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Error al guardar el juego.')
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

    function toggleItem(id: number, list: number[], setList: (l: number[]) => void) {
        setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id])
    }

    const title = game
        ? (defaultType === 'BOARD_GAME' ? 'Editar juego' : 'Editar libro de rol')
        : (defaultType === 'BOARD_GAME' ? 'Añadir juego' : 'Añadir libro de rol')

    return (
        <Modal open={open} onClose={onClose} title={title} width={560}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Nombre</label>
                        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Editorial</label>
                        <input style={inputStyle} value={publisher} onChange={(e) => setPublisher(e.target.value)} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Mín. jugadores</label>
                        <input style={inputStyle} type="number" min="1" value={minPlayers} onChange={(e) => setMinPlayers(e.target.value)} />
                    </div>
                    <div>
                        <label style={labelStyle}>Máx. jugadores</label>
                        <input style={inputStyle} type="number" min="1" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Duración (min)</label>
                        <input style={inputStyle} type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Descripción</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Categorías</label>
                    <div style={{
                        maxHeight: '120px',
                        overflowY: 'auto',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '4px',
                    }}>
                        {categories.map((c) => (
                            <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '0.875rem' }}>
                                <input
                                    type="checkbox"
                                    checked={categoryIds.includes(c.id)}
                                    onChange={() => toggleItem(c.id, categoryIds, setCategoryIds)}
                                />
                                {c.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Mecánicas</label>
                    <div style={{
                        maxHeight: '120px',
                        overflowY: 'auto',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '4px',
                    }}>
                        {mechanics.map((m) => (
                            <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '0.875rem' }}>
                                <input
                                    type="checkbox"
                                    checked={mechanicIds.includes(m.id)}
                                    onChange={() => toggleItem(m.id, mechanicIds, setMechanicIds)}
                                />
                                {m.name}
                            </label>
                        ))}
                    </div>
                </div>

                {error && <p style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}