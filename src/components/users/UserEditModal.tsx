import { useState } from 'react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { usersApi } from '../../api/users.api.ts';
import type { User } from '../../types';

interface SocioEditModalProps {
    user: User
    open: boolean
    onClose: () => void
    onSave: (updated: User) => void
}

export function UserEditModal({ user, open, onClose, onSave }: SocioEditModalProps) {
    const [name, setName] = useState(user.name)
    const [surname, setSurname] = useState(user.surname)
    const [email, setEmail] = useState(user.email)
    const [birthdate, setBirthdate] = useState(user.birthdate)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const updated = await usersApi.update({
                id: user.id,
                name,
                surname,
                email,
                birthdate,
            })
            onSave(updated)
            onClose()
        } catch {
            setError('Error al guardar los cambios. Inténtalo de nuevo.')
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

    const labelStyle: React.CSSProperties = {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        marginBottom: '4px',
        display: 'block',
    }

    return (
        <Modal open={open} onClose={onClose} title="Editar perfil">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={labelStyle}>Nombre</label>
                    <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label style={labelStyle}>Apellidos</label>
                    <input style={inputStyle} value={surname} onChange={(e) => setSurname(e.target.value)} required />
                </div>
                <div>
                    <label style={labelStyle}>Email</label>
                    <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label style={labelStyle}>Fecha de nacimiento</label>
                    <input style={inputStyle} type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
                </div>

                {error && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>{error}</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                    <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}