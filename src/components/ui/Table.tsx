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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                {columns.map((col) => (
                    <th key={col.label} style={{ padding: '10px 16px', fontSize: '0.875rem', color: '#6b7280' }}>
                        {col.label}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row) => (
                <tr
                    key={keyExtractor(row)}
                    onClick={() => onRowClick?.(row)}
                    style={{
                        borderBottom: '1px solid #e5e7eb',
                        cursor: onRowClick ? 'pointer' : 'default',
                    }}
                    onMouseEnter={(e) => {
                        if (onRowClick) {
                            (e.currentTarget as HTMLTableRowElement).style.background = 'var(--color-secondary)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = 'none'
                    }}
                >
                    {columns.map((col) => (
                        <td key={col.label} style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
                            {col.render(row)}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    )
}