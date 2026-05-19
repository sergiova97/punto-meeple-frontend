import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from "./Sidebar.tsx";
import { BottomBar } from "./BottomBar.tsx";
import { MobileMenu } from "./MobileMenu.tsx";
import { useIsMobile } from '../../hooks/useIsMobile';

export function AppShell() {
    const isMobile = useIsMobile()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {!isMobile && <Sidebar />}

            <main
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    background: 'var(--bg-app)',
                    paddingBottom: isMobile ? '80px' : '24px',
                }}
            >
                <Outlet />
            </main>

            {isMobile && (
                <>
                    <BottomBar onOpenMenu={() => setMenuOpen(true)} />
                    {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
                </>
            )}
        </div>
    )
}