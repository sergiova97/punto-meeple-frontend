import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClock, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { config } from '../../config';
import { useAuthStore } from '../../store/auth.store';
import type { Game } from '../../types';

interface GameDetailModalProps {
    game: Game | null
    open: boolean
    onClose: () => void
    onEdit?: () => void
}

export function GameDetailModal({ game, open, onClose, onEdit }: GameDetailModalProps) {
    if (!game) return null

    const authUser = useAuthStore((state) => state.user)
    const canEdit = authUser?.roles.some((r) => r.name === 'ADMIN' || r.name === 'BIBLIOTECARIO')

    const defaultImage = game.type === 'BOARD_GAME' ? '/default-board-game.png' : '/default-rpg.png'
    const imageSrc = game.image ? `${config.apiUrl}/uploads/${game.image}` : defaultImage

    return (
        <Modal open={open} onClose={onClose} title={game.name} width={560}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Imagen */}
                <div style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'var(--bg-app)',
                }}>
                    <img
                        src={imageSrc}
                        alt={game.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = defaultImage }}
                    />
                </div>

                {/* Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FontAwesomeIcon icon={faUsers} style={{ color: 'var(--color-primary)', width: '16px' }} />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Jugadores</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                {game.minPlayers && game.maxPlayers ? `${game.minPlayers} - ${game.maxPlayers}` : '—'}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FontAwesomeIcon icon={faClock} style={{ color: 'var(--color-primary)', width: '16px' }} />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Duración</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                {game.duration ? `${game.duration} min` : '—'}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FontAwesomeIcon icon={faBuilding} style={{ color: 'var(--color-primary)', width: '16px' }} />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Editorial</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{game.publisher}</p>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                {game.description && (
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Descripción</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{game.description}</p>
                    </div>
                )}

                {/* Categorías */}
                {game.categories.length > 0 && (
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Categorías</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {game.categories.map((c) => (
                                <span key={c.id} style={{
                                    padding: '2px 10px',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: 'var(--color-secondary)',
                                    color: 'var(--color-primary)',
                                }}>
                  {c.name}
                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mecánicas */}
                {game.mechanics.length > 0 && (
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Mecánicas</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {game.mechanics.map((m) => (
                                <span key={m.id} style={{
                                    padding: '2px 10px',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: '#f3f4f6',
                                    color: 'var(--text-secondary)',
                                }}>
                  {m.name}
                </span>
                            ))}
                        </div>
                    </div>
                )}

                {canEdit && onEdit && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="primary" onClick={onEdit}>Editar</Button>
                    </div>
                )}
            </div>
        </Modal>
    )
}