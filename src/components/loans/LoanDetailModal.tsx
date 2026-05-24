import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import type { LoanDto, LoanStatus } from '../../types'

interface LoanDetailModalProps {
    loan: LoanDto | null
    open: boolean
    onClose: () => void
}

const STATUS_BADGE: Record<LoanStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    PENDING:  { label: 'Pendiente', variant: 'warning' },
    ACTIVE:   { label: 'Activo',    variant: 'success' },
    RETURNED: { label: 'Devuelto',  variant: 'neutral' },
    OVERDUE:  { label: 'Vencido',   variant: 'danger' },
}

export function LoanDetailModal({ loan, open, onClose }: LoanDetailModalProps) {
    if (!loan) return null
    const { label, variant } = STATUS_BADGE[loan.status]

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
            </div>
        </Modal>
    )
}