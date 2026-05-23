import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { paymentsApi } from '../../api/payments.api'
import type { PaymentDto } from '../../types'

interface PaymentDetailModalProps {
    payment: PaymentDto | null
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

const STATUS_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    IN_REVIEW: { label: 'En revisión', variant: 'info' },
    ACCEPTED:  { label: 'Aceptado',    variant: 'success' },
    DENIED:    { label: 'Denegado',    variant: 'danger' },
}

export function PaymentDetailModal({ payment, open, onClose, onSuccess }: PaymentDetailModalProps) {
    if (!payment) return null

    const { label, variant } = STATUS_BADGE[payment.status]

    async function handleAccept() {
        if (!window.confirm('¿Seguro que quieres aprobar este pago?')) return
        await paymentsApi.accept(payment!.id)
        onSuccess()
        onClose()
    }

    async function handleDeny() {
        if (!window.confirm('¿Seguro que quieres denegar este pago?')) return
        await paymentsApi.deny(payment!.id)
        onSuccess()
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose} title="Detalle del pago">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Socio</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{payment.userName}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Importe</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{payment.amount.toFixed(2)} €</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Método</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{payment.method}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Referencia</span>
                        <p style={{ marginTop: '4px', fontWeight: 500 }}>{payment.reference}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Estado</span>
                        <div style={{ marginTop: '4px' }}>
                            <Badge variant={variant}>{label}</Badge>
                        </div>
                    </div>
                </div>

                <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cuotas incluidas</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                        {payment.periods.map((p) => (
                            <span
                                key={p}
                                style={{
                                    padding: '2px 8px',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: 'var(--color-secondary)',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>

                {payment.status === 'IN_REVIEW' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                        <Button variant="danger" onClick={handleDeny}>Denegar</Button>
                        <Button variant="primary" onClick={handleAccept}>Aprobar</Button>
                    </div>
                )}
            </div>
        </Modal>
    )
}