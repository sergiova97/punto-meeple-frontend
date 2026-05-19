import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'

export default function LoginPage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setAuth(
            { id: 1, email, name: 'Admin', surname: 'Meeple', birthdate: '', registerDate: '', profileImage: null, roles: [] },
            'mock-token',
        )
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
            <button type="submit">Entrar</button>
        </form>
    )
}