import { Modal } from './Modal';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface SuccessModalProps {
    open: boolean
    onClose: () => void
    title: string
    message: string
}

export function SuccessModal({ open, onClose, title, message }: SuccessModalProps) {
    return (
        <Modal open={open} onClose={onClose} title="">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <FontAwesomeIcon icon={faCheck} style={{ color: '#065f46', width: '24px', height: '24px' }} />
                </div>
                <p style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>
                    {title}
                </p>
                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {message}
                </p>
                <Button variant="primary" onClick={onClose}>Cerrar</Button>
            </div>
        </Modal>
    )
}