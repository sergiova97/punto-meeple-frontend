import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { SuccessModal } from '../ui/SuccessModal'
import { loansApi } from '../../api/loans.api'
import { useAuthStore } from '../../store/auth.store'
import type { Game } from '../../types'

interface LoanRequestModalProps {
    game: Game | null
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function LoanRequestModal({ game, open, onClose, onSuccess }: LoanRequestModalProps) {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const authUser = useAuthStore((state) => state.user)
    const today = new Date().toISOString().split('T')[0]

    function handleClose() {
        setSuccess(false)
        setStartDate('')
        setEndDate('')
        setError('')
        onClose()
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!authUser || !game) return
        setError('')
        setLoading(true)

        try {
            await loansApi.create({
                userId: authUser.id,
                gameId: game.id,
                startDate,
                endDate,
            })
            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Error al solicitar el préstamo.')
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
            <Modal open={open && !success} onClose={handleClose} title={`Solicitar préstamo: ${game?.name}`}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}>Fecha de inicio</label>
                        <input
                            style={inputStyle}
                            type="date"
                            value={startDate}
                            min={today}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Fecha de fin</label>
                        <input
                            style={inputStyle}
                            type="date"
                            value={endDate}
                            min={startDate || today}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{
                            fontSize: '0.85rem', color: '#991b1b',
                            background: '#fee2e2', border: '1px solid #fca5a5',
                            padding: '10px 14px', borderRadius: '8px', textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button variant="secondary" type="button" onClick={handleClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Solicitando...' : 'Solicitar préstamo'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <SuccessModal
                open={success}
                onClose={() => { onSuccess(); handleClose() }}
                title="¡Préstamo solicitado correctamente!"
                message="El bibliotecario revisará tu solicitud pronto."
            />
        </>
    )
}