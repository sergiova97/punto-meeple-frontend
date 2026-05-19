import {Button} from "./Button.tsx";

interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button
                variant="secondary"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                Anterior
            </Button>
            <span style={{ padding: '6px 12px', fontSize: '0.875rem', color: '#6b7280' }}>
        {page} / {totalPages}
      </span>
            <Button
                variant="secondary"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                Siguiente
            </Button>
        </div>
    )
}