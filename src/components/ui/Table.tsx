interface Column<T> {
    label: string
    render: (row: T) => React.ReactNode
}

interface TableProps<T> {
    columns: Column<T>[]
    data: T[]
    keyExtractor: (row: T) => number | string
    onRowClick?: (row: T) => void
}

export function Table<T>({ columns, data, keyExtractor, onRowClick }: TableProps<T>) {
    return (
        <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ background: 'var(--color-primary)' }}>
                    {columns.map((col) => (
                        <th
                            key={col.label}
                            style={{
                                padding: '12px 16px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: '#ffffff',
                                textAlign: 'left',
                                letterSpacing: '0.03em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr
                        key={keyExtractor(row)}
                        onClick={() => onRowClick?.(row)}
                        style={{
                            background: index % 2 === 0 ? '#ffffff' : '#f8f9ff',
                            cursor: onRowClick ? 'pointer' : 'default',
                            transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            if (onRowClick) {
                                (e.currentTarget as HTMLTableRowElement).style.background = 'var(--color-secondary)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.background = index % 2 === 0 ? '#ffffff' : '#f8f9ff'
                        }}
                    >
                        {columns.map((col) => (
                            <td
                                key={col.label}
                                style={{
                                    padding: '12px 16px',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-primary)',
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                {col.render(row)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}