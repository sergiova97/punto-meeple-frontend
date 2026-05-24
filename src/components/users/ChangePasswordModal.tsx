import { useState } from 'react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { usersApi } from '../../api/users.api';

interface ChangePasswordModalProps {
    userId: number
    open: boolean
    onClose: () => void
    isReset?: boolean
}

export function ChangePasswordModal({ userId, open, onClose, isReset = false }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    function handleClose() {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setError('')
        setSuccess(false)
        onClose()
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        setLoading(true)

        try {
            if (isReset) {
                await usersApi.resetPassword(userId, { newPassword })
            } else {
                await usersApi.changePassword(userId, { currentPassword, newPassword })
            }
            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Error al cambiar la contraseña.')
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
        fontFamily: 'inherit',
    }

    const labelStyle: React.CSSProperties = {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        marginBottom: '4px',
        display: 'block',
        fontWeight: 600,
    }

    return (
        <Modal open={open} onClose={handleClose} title={isReset ? 'Restablecer contraseña' : 'Cambiar contraseña'}>
            {success ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                    <p style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
                        ¡Contraseña actualizada correctamente!
                    </p>
                    <Button variant="primary" onClick={handleClose}>Cerrar</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isReset && (
                        <div>
                            <label style={labelStyle}>Contraseña actual</label>
                            <input
                                style={inputStyle}
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label style={labelStyle}>Nueva contraseña</label>
                        <input
                            style={inputStyle}
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Confirmar nueva contraseña</label>
                        <input
                            style={inputStyle}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button variant="secondary" type="button" onClick={handleClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    )
}