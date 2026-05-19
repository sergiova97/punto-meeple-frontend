import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faMoneyBill, faBorderAll } from '@fortawesome/free-solid-svg-icons';

interface BottomBarProps {
    onOpenMenu: () => void
}

export function BottomBar({ onOpenMenu }: BottomBarProps) {
    const items = [
        { to: '/dashboard', icon: faHome, label: 'Inicio' },
        { to: '/users', icon: faUsers, label: 'Socios' },
        { to: '/membership-fees', icon: faMoneyBill, label: 'Cuotas' },
    ]

    return (
        <nav
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                zIndex: 100,
            }}
        >
            {items.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'none',
                        color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                        fontSize: '0.7rem',
                        fontWeight: isActive ? 600 : 400,
                    })}
                >
                    <FontAwesomeIcon icon={item.icon} style={{ width: '20px', height: '20px' }} />
                    {item.label}
                </NavLink>
            ))}

            <button
                onClick={onOpenMenu}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontSize: '0.7rem',
                }}
            >
                <FontAwesomeIcon icon={faBorderAll} style={{ width: '20px', height: '20px' }} />
                Menú
            </button>
        </nav>
    )
}