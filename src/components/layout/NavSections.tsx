import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { NAV_SECTIONS } from './navSections'

interface NavSectionsProps {
    onNavigate?: () => void
}

export function NavSections({ onNavigate }: NavSectionsProps) {
    const [openSections, setOpenSections] = useState<string[]>(
        NAV_SECTIONS.map((s) => s.label),
    )

    function toggleSection(label: string) {
        setOpenSections((prev) =>
            prev.includes(label)
                ? prev.filter((s) => s !== label)
                : [...prev, label],
        )
    }

    return (
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {NAV_SECTIONS.map((section) => {
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
                                color: 'var(--text-primary)',
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
                                        onClick={onNavigate}
                                        style={({ isActive }) => ({
                                            display: 'block',
                                            padding: '8px 16px',
                                            fontSize: '0.875rem',
                                            color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                                            background: isActive ? 'var(--color-secondary)' : 'none',
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
    )
}