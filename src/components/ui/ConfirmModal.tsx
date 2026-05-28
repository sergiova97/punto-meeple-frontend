import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    confirmVariant?: 'primary' | 'danger'
    loading?: boolean
}

export function ConfirmModal({
                                 open,
                                 onClose,
                                 onConfirm,
                                 title,
                                 message,
                                 confirmLabel = 'Confirmar',
                                 confirmVariant = 'primary',
                                 loading = false,
                             }: ConfirmModalProps) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
                        {loading ? 'Procesando...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}