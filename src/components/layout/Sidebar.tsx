import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

interface SidebarSection {
    label: string
    icon: typeof faUsers
    children: { label: string; to: string }[]
}

const SECTIONS: SidebarSection[] = [
    {
        label: 'Socios',
        icon: faUsers,
        children: [
            { label: 'Listado general', to: '/users' },
            { label: 'Cuotas', to: '/membership-fees' },
        ],
    },
]

export function Sidebar() {
    const [openSections, setOpenSections] = useState<string[]>(['Socios'])

    function toggleSection(label: string) {
        setOpenSections((prev) =>
            prev.includes(label)
                ? prev.filter((s) => s !== label)
                : [...prev, label],
        )
    }

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
            {/* Header */}
            <div
                style={{
                    padding: '20px 16px',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#111827',
                }}
            >
                Punto Meeple
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {SECTIONS.map((section) => {
                    const isOpen = openSections.includes(section.label)

                    return (
                        <div key={section.label}>
                            <button
                                onClick={() => toggleSection(section.label)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 16px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#111827',
                                }}
                            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FontAwesomeIcon icon={section.icon} style={{ width: '16px' }} />
                  <span>{section.label}</span>
                </span>
                                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} style={{ width: '12px' }} />
                            </button>

                            {isOpen && (
                                <div style={{ paddingLeft: '16px' }}>
                                    {section.children.map((child) => (
                                        <NavLink
                                            key={child.to}
                                            to={child.to}
                                            style={({ isActive }) => ({
                                                display: 'block',
                                                padding: '8px 16px',
                                                fontSize: '0.875rem',
                                                color: isActive ? '#111827' : '#6b7280',
                                                background: isActive ? '#f3f4f6' : 'none',
                                                borderRadius: '6px',
                                                textDecoration: 'none',
                                                fontWeight: isActive ? 500 : 400,
                                            })}
                                        >
                                            {child.label}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>
        </aside>
    )
}