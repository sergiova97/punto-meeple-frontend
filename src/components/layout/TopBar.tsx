import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '../../store/auth.store'

export function TopBar() {
    const navigate = useNavigate()
    const { user, clearAuth } = useAuthStore()

    function handleLogout() {
        clearAuth()
        navigate('/login')
    }

    function handleProfile() {
        if (user) navigate(`/users/${user.id}`)
    }

    return (
        <header style={{
            height: '56px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            gap: '8px',
            flexShrink: 0,
        }}>
            {import.meta.env.VITE_ENV === 'dev' && user?.roles && (
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    marginRight: '12px',
                    paddingRight: '12px',
                    borderRight: '1px solid var(--border)',
                }}>
                    {user.roles.map((r) => (
                        <span
                            key={r.id}
                            style={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: '99px',
                                background: 'var(--color-secondary)',
                                color: 'var(--color-primary)',
                            }}
                        >
                        {r.name}
                      </span>
                    ))}
                </div>
            )}
            <button
                onClick={handleProfile}
                title="Mi perfil"
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
                <span style={{ fontWeight: 500 }}>{user?.name} {user?.surname}</span>
                <FontAwesomeIcon icon={faUser} style={{ width: '18px', height: '18px' }} />
            </button>

            <button
                onClick={handleLogout}
                title="Cerrar sesión"
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '8px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
                <span>Cerrar sesión</span>
                <FontAwesomeIcon icon={faRightFromBracket} style={{ width: '18px', height: '18px' }} />
            </button>
        </header>
    )
}