import {BottomBar} from "./BottomBar.tsx";
import {NavSections} from "./NavSections.tsx";

interface MobileMenuProps {
    onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'var(--bg-card)',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <NavSections />
            <BottomBar onOpenMenu={onClose} />
        </div>
    )
}