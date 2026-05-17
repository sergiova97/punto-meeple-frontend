import { Outlet } from 'react-router-dom'
import {Sidebar} from "./Sidebar.tsx";

export function AppShell() {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                <Outlet />
            </main>
        </div>
    )
}