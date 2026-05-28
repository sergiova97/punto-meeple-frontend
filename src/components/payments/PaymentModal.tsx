import { useState } from 'react'
import { Modal } from '../ui/Modal.tsx'
import { Button } from '../ui/Button.tsx'
import { paymentsApi } from '../../api/payments.api.ts'
import type {MembershipFeeDto} from "../../types";
import {SuccessModal} from "../ui/SuccessModal.tsx";

interface PaymentModalProps {
    open: boolean
    onClose: () => void
    fees: MembershipFeeDto[]
    onSuccess: () => void
}

export function PaymentModal({ open, onClose, fees, onSuccess }: PaymentModalProps) {
    const [reference, setReference] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const total = fees.reduce((sum, fee) => sum + Number(fee.price), 0)
    const feeIds = fees.map((f) => f.id)

    function handleClose() {
        setSuccess(false)
        setReference('')
        setError('')
        onClose()
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await paymentsApi.create({ reference, membershipFeeIds: feeIds })
            setSuccess(true)
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
        <>
            <Modal open={open && !success} onClose={handleClose} title="Registrar pago">
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {feeIds.length === 1 ? '1 cuota seleccionada' : `${feeIds.length} cuotas seleccionadas`}
                </p>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'block', marginBottom: '16px' }}>
                    {total.toFixed(2)} €
                </span>
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
                    {error && (
                        <div style={{
                            fontSize: '0.85rem', color: '#991b1b',
                            background: '#fee2e2', border: '1px solid #fca5a5',
                            padding: '10px 14px', borderRadius: '8px',
                        }}>
                            {error}
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                        <Button variant="secondary" type="button" onClick={handleClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Registrando...' : 'Confirmar pago'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <SuccessModal
                open={success}
                onClose={() => { onSuccess(); handleClose() }}
                title="¡Pago registrado correctamente!"
                message={`Tu pago de ${total.toFixed(2)} € está pendiente de revisión por el tesorero.`}
            />
        </>
    )
}