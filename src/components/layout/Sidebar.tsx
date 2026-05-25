import {NavSections} from "./NavSections.tsx";
import {useNavigate} from "react-router-dom";

export function Sidebar() {
    const navigate = useNavigate()

    return (
        <aside
            style={{
                width: '260px',
                height: '100vh',
                background: '#ffffff',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}
        >
            <div
                onClick={() => navigate('/dashboard')}
                style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '20px',
                }}
            >
                <img src="/logo.png" alt="Punto Meeple" style={{ width: '50px', height: '50px' }} />
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    Punto Meeple
                </span>
            </div>

            <NavSections />
        </aside>
    )
}