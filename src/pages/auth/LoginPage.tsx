import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import {authApi} from "../../api/auth.api.ts";

export default function LoginPage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { access_token, user } = await authApi.login({ email, password })
            setAuth(user, access_token)
            navigate('/dashboard')
        } catch {
            setError('Email o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
        navigate('/dashboard')
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Punto Meeple</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
            </button>
        </form>
    )
}