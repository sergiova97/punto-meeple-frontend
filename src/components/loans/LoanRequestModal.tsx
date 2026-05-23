import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { loansApi } from '../../api/loans.api';
import { useAuthStore } from '../../store/auth.store';
import type { Game } from '../../types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

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
            setStartDate('')
            setEndDate('')
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
        <Modal open={open} onClose={onClose} title={`Solicitar préstamo: ${game?.name}`}>
            {success ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <FontAwesomeIcon icon={faCheck} style={{ color: '#065f46', width: '24px', height: '24px' }} />
                    </div>
                    <p style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
                        ¡Préstamo solicitado correctamente!
                    </p>
                    <Button variant="primary" onClick={() => { onClose(); onSuccess(); setSuccess(false); setStartDate(''); setEndDate('') }}>
                        Cerrar
                    </Button>
                </div>
            ) : (
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

                    {error && <p style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>{error}</p>}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Solicitando...' : 'Solicitar préstamo'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    )
}