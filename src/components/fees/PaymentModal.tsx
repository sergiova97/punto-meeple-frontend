import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { paymentsApi } from '../../api/payments.api'

interface PaymentModalProps {
    open: boolean
    onClose: () => void
    feeIds: number[]
    onSuccess: () => void
}

export function PaymentModal({ open, onClose, feeIds, onSuccess }: PaymentModalProps) {
    const [reference, setReference] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await paymentsApi.create({ reference, membershipFeeIds: feeIds })
            onSuccess()
            onClose()
            setReference('')
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Error al registrar el pago.')
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
    }

    return (
        <Modal open={open} onClose={onClose} title="Registrar pago">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {feeIds.length === 1 ? '1 cuota seleccionada' : `${feeIds.length} cuotas seleccionadas`}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                        Referencia del pago
                    </label>
                    <input
                        style={inputStyle}
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Ej: Transferencia 2026-01"
                        required
                    />
                </div>

                {error && <p style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                    <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Registrando...' : 'Confirmar pago'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}