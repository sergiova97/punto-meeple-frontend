import { useState } from 'react'
import { Modal } from '../ui/Modal.tsx'
import { Button } from '../ui/Button.tsx'
import { Badge } from '../ui/Badge.tsx'
import { PaymentModal } from '../payments/PaymentModal.tsx'
import type { MembershipFeeDto, MembershipFeeStatus } from '../../types'

interface FeeDetailModalProps {
    fee: MembershipFeeDto | null
    open: boolean
    onClose: () => void
    onSuccess: () => void
    canPay?: boolean
    canChangeStatus?: boolean
    onStatusChange?: (ids: number[], status: MembershipFeeStatus) => void
}

const STATUS_BADGE: Record<MembershipFeeStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    PAID:      { label: 'Pagada',      variant: 'success' },
    PENDING:   { label: 'Pendiente',   variant: 'warning' },
    OVERDUE:   { label: 'Vencida',     variant: 'danger' },
    IN_REVIEW: { label: 'En revisión', variant: 'info' },
}

const PAYABLE_STATUSES: MembershipFeeStatus[] = ['PENDING', 'OVERDUE']

export function FeeDetailModal({ fee, open, onClose, onSuccess, canPay, canChangeStatus, onStatusChange }: FeeDetailModalProps) {
    const [paymentOpen, setPaymentOpen] = useState(false)

    if (!fee) return null

    const { label, variant } = STATUS_BADGE[fee.status]
    const isPayable = PAYABLE_STATUSES.includes(fee.status)

    return (
        <>
            <Modal open={open} onClose={onClose} title="Detalle de cuota">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Socio</span>
                            <p style={{ marginTop: '4px', fontWeight: 500 }}>{fee.userName}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Periodo</span>
                            <p style={{ marginTop: '4px', fontWeight: 500 }}>{fee.period}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Precio</span>
                            <p style={{ marginTop: '4px', fontWeight: 500 }}>{fee.price} €</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Estado</span>
                            <div style={{ marginTop: '4px' }}>
                                <Badge variant={variant}>{label}</Badge>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                        {canPay && isPayable && (
                            <Button variant="primary" onClick={() => setPaymentOpen(true)}>
                                Pagar
                            </Button>
                        )}
                        {canChangeStatus && fee.status === 'IN_REVIEW' && (
                            <>
                                <Button variant="danger" onClick={() => { onStatusChange?.([fee.id], 'PENDING'); onClose() }}>
                                    Rechazar
                                </Button>
                                <Button variant="primary" onClick={() => { onStatusChange?.([fee.id], 'PAID'); onClose() }}>
                                    Aprobar
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>

            <PaymentModal
                open={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                fees={[fee]}
                onSuccess={() => {
                    setPaymentOpen(false)
                    onSuccess()
                    onClose()
                }}
            />
        </>
    )
}