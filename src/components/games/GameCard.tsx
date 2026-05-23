import { config } from '../../config';
import type { Game } from '../../types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faUsers} from "@fortawesome/free-solid-svg-icons";

interface GameCardProps {
    game: Game
    onClick: (game: Game) => void
}

export function GameCard({ game, onClick }: GameCardProps) {
    const defaultImage = game.type === 'BOARD_GAME' ? '/default-board-game.png' : '/default-rpg.png'
    const imageSrc = game.image ? `${config.imagesUrl}${game.image}` : defaultImage

    return (
        <div
            onClick={() => onClick(game)}
            style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
            }}
        >
            <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-app)' }}>
                <img
                    src={imageSrc}
                    alt={game.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = defaultImage }}
                />
            </div>

            <div style={{ padding: '12px' }}>
                <p style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {game.name}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FontAwesomeIcon icon={faUsers} style={{ width: '12px' }} />
                        {game.minPlayers && game.maxPlayers ? `${game.minPlayers}-${game.maxPlayers}` : '—'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FontAwesomeIcon icon={faClock} style={{ width: '12px' }} />
                        {game.duration ? `${game.duration} min` : '—'}
                    </span>
                </div>
            </div>
        </div>
    )
}