import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import type { LoanDto, LoanStatus } from '../../types';
import {useAuthStore} from "../../store/auth.store.ts";
import {loansApi} from "../../api/loans.api.ts";
import {Button} from "../ui/Button.tsx";
import {useState} from "react";

interface LoanDetailModalProps {
    loan: LoanDto | null
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

const STATUS_BADGE: Record<LoanStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    PENDING:  { label: 'Pendiente', variant: 'warning' },
    ACTIVE:   { label: 'Activo',    variant: 'success' },
    RETURNED: { label: 'Devuelto',  variant: 'neutral' },
    OVERDUE:  { label: 'Vencido',   variant: 'danger' },
    CANCELLED:  { label: 'Cancelado',   variant: 'danger' },
}

export function LoanDetailModal({ loan, open, onClose, onSuccess }: LoanDetailModalProps) {
    const authUser = useAuthStore((state) => state.user)

    const [error, setError] = useState('')

    if (!loan) return null

    const { label, variant } = STATUS_BADGE[loan.status]
    const isOwner = authUser?.id === loan.userId

    async function handleStatusChange(status: LoanStatus) {
        if (!authUser || !loan) return
        if (!window.confirm(`¿Seguro que quieres cambiar el estado a ${STATUS_BADGE[status].label}?`)) return
        setError('')
        try {
            await loansApi.updateStatus(loan.id, status, authUser.id)
            onSuccess?.()
            onClose()
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Error al actualizar el estado.')
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Detalle del préstamo">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Juego</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{loan.gameName}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Estado</span>
                        <div style={{ marginTop: '4px' }}>
                            <Badge variant={variant}>{label}</Badge>
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha inicio</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{loan.startDate}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha fin</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{loan.endDate}</p>
                    </div>
                    {loan.returnDate && (
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha devolución</span>
                            <p style={{ marginTop: '4px', fontWeight: 500 }}>{loan.returnDate}</p>
                        </div>
                    )}
                </div>
                {isOwner && (
                    <>
                        {error && (
                            <div style={{
                                fontSize: '0.85rem', color: '#991b1b',
                                background: '#fee2e2', border: '1px solid #fca5a5',
                                padding: '10px 14px', borderRadius: '8px', marginTop: '8px',
                            }}>
                                {error}
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                            {loan.status === 'PENDING' && (
                                <>
                                    <Button variant="danger" onClick={() => handleStatusChange('CANCELLED')}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" onClick={() => handleStatusChange('ACTIVE')}>
                                        Activar
                                    </Button>
                                </>
                            )}
                            {(loan.status === 'ACTIVE' || loan.status === 'OVERDUE') && (
                                <Button variant="primary" onClick={() => handleStatusChange('RETURNED')}>
                                    Devolver
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}