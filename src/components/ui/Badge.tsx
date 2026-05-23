type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const STYLES: Record<BadgeVariant, React.CSSProperties> = {
    success: { background: '#d1fae5', color: '#065f46' },
    warning: { background: '#fef3c7', color: '#92400e' },
    danger:  { background: '#fee2e2', color: '#991b1b' },
    info:    { background: '#dbeafe', color: '#1e40af' },
    neutral: { background: '#f3f4f6', color: '#374151' },
}

export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: React.ReactNode }) {
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '99px',
            fontSize: '0.75rem',
            fontWeight: 600,
            ...STYLES[variant],
        }}>
      {children}
    </span>
    )
}