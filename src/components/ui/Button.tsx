import { type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
}

const STYLES: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        background: 'var(--btn-primary-bg)',
        color: 'var(--btn-primary-text)',
    },
    secondary: {
        background: 'var(--btn-secondary-bg)',
        color: 'var(--btn-secondary-text)',
    },
    danger: {
        background: 'var(--btn-danger-bg)',
        color: 'var(--btn-danger-text)',
    },
}

const HOVER_STYLES: Record<ButtonVariant, string> = {
    primary: 'var(--btn-primary-hover)',
    secondary: 'var(--btn-secondary-hover)',
    danger: 'var(--btn-danger-hover)',
}

export function Button({ variant = 'primary', disabled, children, style, ...props }: ButtonProps) {
    return (
        <button
            disabled={disabled}
            style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: disabled ? 'var(--btn-disabled-bg)' : STYLES[variant].background,
                color: disabled ? 'var(--btn-disabled-text)' : STYLES[variant].color,
                transition: 'background 0.15s ease',
                ...style,
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    (e.currentTarget as HTMLButtonElement).style.background = HOVER_STYLES[variant]
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    (e.currentTarget as HTMLButtonElement).style.background = STYLES[variant].background as string
                }
            }}
            {...props}
        >
            {children}
        </button>
    )
}