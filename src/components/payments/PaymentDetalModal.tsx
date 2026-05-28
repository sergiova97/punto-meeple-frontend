import { useState } from 'react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { SuccessModal } from '../ui/SuccessModal.tsx';
import { ConfirmModal } from '../ui/ConfirmModal.tsx';
import { paymentsApi } from '../../api/payments.api.ts';
import type { PaymentDto } from '../../types';

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
    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState({ title: '', message: '' })
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState<'accept' | 'deny' | null>(null)
    const [loading, setLoading] = useState(false)

    if (!payment) return null

    const { label, variant } = STATUS_BADGE[payment.status]

    function handleClose() {
        setSuccess(false)
        setConfirmOpen(false)
        setConfirmAction(null)
        onClose()
    }

    async function handleConfirm() {
        if (!confirmAction) return
        setLoading(true)
        try {
            if (confirmAction === 'accept') {
                await paymentsApi.accept(payment!.id)
                setSuccessMessage({
                    title: '¡Pago aprobado correctamente!',
                    message: `El pago de ${payment!.amount.toFixed(2)} € ha sido aprobado. Las cuotas quedan marcadas como pagadas.`,
                })
            } else {
                await paymentsApi.deny(payment!.id)
                setSuccessMessage({
                    title: '¡Pago denegado!',
                    message: `El pago de ${payment!.amount.toFixed(2)} € ha sido denegado. Las cuotas vuelven al estado pendiente.`,
                })
            }
            setConfirmOpen(false)
            setSuccess(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal open={open && !success && !confirmOpen} onClose={handleClose} title="Detalle del pago">
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
                                <span key={p} style={{
                                    padding: '2px 8px',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: 'var(--color-secondary)',
                                    color: 'var(--color-primary)',
                                }}>
                  {p}
                </span>
                            ))}
                        </div>
                    </div>

                    {payment.status === 'IN_REVIEW' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                            <Button variant="danger" onClick={() => { setConfirmAction('deny'); setConfirmOpen(true) }}>Denegar</Button>
                            <Button variant="primary" onClick={() => { setConfirmAction('accept'); setConfirmOpen(true) }}>Aprobar</Button>
                        </div>
                    )}
                </div>
            </Modal>

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                title={confirmAction === 'accept' ? 'Aprobar pago' : 'Denegar pago'}
                message={confirmAction === 'accept'
                    ? `¿Seguro que quieres aprobar el pago de ${payment.amount.toFixed(2)} €? Las cuotas quedarán marcadas como pagadas.`
                    : `¿Seguro que quieres denegar el pago de ${payment.amount.toFixed(2)} €? Las cuotas volverán al estado pendiente.`
                }
                confirmLabel={confirmAction === 'accept' ? 'Aprobar' : 'Denegar'}
                confirmVariant={confirmAction === 'accept' ? 'primary' : 'danger'}
                loading={loading}
            />

            <SuccessModal
                open={success}
                onClose={() => { onSuccess(); handleClose() }}
                title={successMessage.title}
                message={successMessage.message}
            />
        </>
    )
}