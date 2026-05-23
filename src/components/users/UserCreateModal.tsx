import { useState } from 'react'
import { Modal } from '../ui/Modal.tsx'
import { Button } from '../ui/Button.tsx'
import { usersApi } from '../../api/users.api.ts'

interface UserCreateModalProps {
    open: boolean
    onClose: () => void
    onSave: () => void
}

export function UserCreateModal({ open, onClose, onSave }: UserCreateModalProps) {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await usersApi.create({ name, surname, email, password, birthdate })
            onSave()
            onClose()
        } catch (e: any) {
            setError(e.response?.data?.message ?? 'Error al crear el socio. Inténtalo de nuevo.')
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
        <Modal open={open} onClose={onClose} title="Nuevo socio">
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
                    <label style={labelStyle}>Contraseña temporal</label>
                    <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
                        {loading ? 'Creando...' : 'Crear socio'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}