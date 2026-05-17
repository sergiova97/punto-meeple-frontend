interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                style={{ padding: '6px 12px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
                Anterior
            </button>
            <span style={{ padding: '6px 12px', fontSize: '0.875rem', color: '#6b7280' }}>
        {page} / {totalPages}
      </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                style={{ padding: '6px 12px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
            >
                Siguiente
            </button>
        </div>
    )
}