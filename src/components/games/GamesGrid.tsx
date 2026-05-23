import { useEffect, useState } from 'react';
import { gamesApi } from '../../api/games.api';
import { GameCard } from './GameCard';
import { GameDetailModal } from './GameDetailModal';
import { GameCreateModal } from './GameCreateModal';
import { Pagination } from '../ui/Pagination';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/auth.store';
import type { Game, GameType } from '../../types';

interface GamesGridProps {
    gameType: GameType
}

export function GamesGrid({ gameType }: GamesGridProps) {
    const [games, setGames] = useState<Game[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [filterName, setFilterName] = useState('')
    const [selectedGame, setSelectedGame] = useState<Game | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [createOpen, setCreateOpen] = useState(false)
    const [editGame, setEditGame] = useState<Game | null>(null)
    const [formOpen, setFormOpen] = useState(false)
    const limit = 12

    const authUser = useAuthStore((state) => state.user)
    const canCreate = authUser?.roles.some((r) => r.name === 'ADMIN' || r.name === 'BIBLIOTECARIO')

    function loadGames() {
        gamesApi.getAll({
            type: gameType,
            name: filterName || undefined,
            page,
            limit,
        }).then((res) => {
            setGames(res.data)
            setTotal(res.total)
        })
    }

    useEffect(() => {
        loadGames()
    }, [page, filterName, gameType])

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        fontSize: '0.875rem',
        outline: 'none',
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
                <input
                    style={inputStyle}
                    placeholder="Buscar por nombre..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    onBlur={() => setPage(1)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); loadGames() } }}
                />
                {canCreate && (
                    <Button variant="primary" onClick={() => { setEditGame(null); setCreateOpen(true) }}>
                        {gameType === 'BOARD_GAME' ? 'Añadir juego' : 'Añadir libro'}
                    </Button>
                )}
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
            }}>
                {games.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        onClick={(g) => { setSelectedGame(g); setDetailOpen(true) }}
                    />
                ))}
            </div>

            <Pagination
                page={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={setPage}
            />

            <GameDetailModal
                game={selectedGame}
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                onEdit={() => {
                    setEditGame(selectedGame)
                    setDetailOpen(false)
                    setFormOpen(true)
                }}
            />

            <GameCreateModal
                open={createOpen || formOpen}
                onClose={() => { setCreateOpen(false); setFormOpen(false); setEditGame(null) }}
                onSave={() => { loadGames(); setCreateOpen(false); setFormOpen(false); setEditGame(null) }}
                game={editGame}
                defaultType={gameType}
            />
        </div>
    )
}