import { type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '24px',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '480px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} style={{ width: '18px', height: '18px' }} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    )
}