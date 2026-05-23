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

    async function handleSubmit() {
        console.log('handleSubmit llamado')
        setError('')
        setLoading(true)

        try {
            const { access_token, user } = await authApi.login({ email, password })
            setAuth(user, access_token)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Email o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1.5px solid var(--border)',
        fontSize: '0.9rem',
        fontFamily: 'inherit',
        outline: 'none',
        background: '#fff',
        color: 'var(--text-primary)',
        transition: 'border-color 0.15s ease',
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-app)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '24px',
            }}>

                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    padding: '40px 36px',
                }}>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <img
                                src="/logo.png"
                                alt="Punto Meeple"
                                style={{ width: '150px', height: '150px' }}
                            />
                        </div>
                        <h1 style={{
                            fontSize: '1.6rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: '4px',
                        }}>
                            Punto Meeple
                        </h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Accede a tu cuenta
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                            }}>
                                Correo electrónico
                            </label>
                            <input
                                style={inputStyle}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="socio@puntomeeple.es"
                                required
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                            }}>
                                Contraseña
                            </label>
                            <input
                                style={inputStyle}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        {error && (
                            <p style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-error)',
                                background: '#fee2e2',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                textAlign: 'center',
                            }}>
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '11px',
                                borderRadius: '8px',
                                border: 'none',
                                background: loading ? 'var(--btn-disabled-bg)' : 'var(--btn-primary-bg)',
                                color: loading ? 'var(--btn-disabled-text)' : 'var(--btn-primary-text)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.15s ease',
                                marginTop: '8px',
                            }}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}