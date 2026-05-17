import { Outlet } from 'react-router-dom'

export function AppShell() {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ width: '240px', background: '#1a1007', color: 'white' }}>
                Sidebar
            </aside>
            <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                <Outlet />
            </main>
        </div>
    )
}