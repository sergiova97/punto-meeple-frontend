import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import {BottomBar} from "./BottomBar.tsx";
import {NAV_SECTIONS} from "./navSections.ts";

interface MobileMenuProps {
    onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
    const [openSections, setOpenSections] = useState<string[]>(['Socios'])

    function toggleSection(label: string) {
        setOpenSections((prev) =>
            prev.includes(label)
                ? prev.filter((s) => s !== label)
                : [...prev, label],
        )
    }

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

            <div
                style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/logo.png" alt="Punto Meeple" style={{ width: '32px', height: '32px' }} />
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            Punto Meeple
          </span>
                </div>
                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                    <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
                </button>
            </div>

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
                                    padding: '12px 16px',
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
                                            onClick={onClose}
                                            style={({ isActive }) => ({
                                                display: 'block',
                                                padding: '10px 16px',
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

            <BottomBar onOpenMenu={onClose} />
        </div>
    )
}