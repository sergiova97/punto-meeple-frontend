import {useEffect, useState} from 'react'
import { Table } from '../ui/Table'
import { Pagination } from '../ui/Pagination'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { MembershipFeeDto, MembershipFeeStatus } from '../../types'

interface FeeTableProps {
    fees: MembershipFeeDto[]
    total: number
    page: number
    onPageChange: (page: number) => void
    onRowClick: (fee: MembershipFeeDto) => void
    onPay?: (ids: number[]) => void
    showUserColumn?: boolean
    showSelectAll?: boolean
    resetSelection?: boolean
}

const STATUS_BADGE: Record<MembershipFeeStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    PAID:      { label: 'Pagada',      variant: 'success' },
    PENDING:   { label: 'Pendiente',   variant: 'warning' },
    OVERDUE:   { label: 'Vencida',     variant: 'danger' },
    IN_REVIEW: { label: 'En revisión', variant: 'info' },
}

const PAYABLE_STATUSES: MembershipFeeStatus[] = ['PENDING', 'OVERDUE']

export function FeeTable({ fees, total, page, onPageChange, onRowClick, onPay, showUserColumn = false, showSelectAll = false, resetSelection = false }: FeeTableProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const limit = 10
    const totalPages = Math.ceil(total / limit)
    const payableFees = fees.filter((f) => PAYABLE_STATUSES.includes(f.status))
    const allPayableSelected = payableFees.length > 0 && payableFees.every((f) => selectedIds.includes(f.id))

    useEffect(() => {
        setSelectedIds([])
    }, [resetSelection])

    function toggleSelect(id: number, status: MembershipFeeStatus) {
        if (!PAYABLE_STATUSES.includes(status)) return
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        )
    }

    function toggleAllPayable() {
        if (allPayableSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(payableFees.map((f) => f.id))
        }
    }

    const columns = [
        {
            label: '',
            render: (fee: MembershipFeeDto) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(fee.id)}
                    disabled={!PAYABLE_STATUSES.includes(fee.status)}
                    onChange={() => toggleSelect(fee.id, fee.status)}
                    onClick={(e) => e.stopPropagation()}
                />
            ),
        },
        ...(showUserColumn ? [{ label: 'Socio', render: (fee: MembershipFeeDto) => fee.userName }] : []),
        { label: 'Periodo', render: (fee: MembershipFeeDto) => fee.period },
        { label: 'Precio', render: (fee: MembershipFeeDto) => `${fee.price} €` },
        {
            label: 'Estado',
            render: (fee: MembershipFeeDto) => {
                const { label, variant } = STATUS_BADGE[fee.status]
                return <Badge variant={variant}>{label}</Badge>
            },
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                {showSelectAll ? (
                    <button
                        type="button"
                        onClick={toggleAllPayable}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: payableFees.length === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '0.8rem',
                            color: payableFees.length === 0 ? 'var(--text-secondary)' : 'var(--color-primary)',
                            fontWeight: 600,
                            opacity: payableFees.length === 0 ? 0.5 : 1,
                        }}
                        disabled={payableFees.length === 0}
                    >
                        {allPayableSelected ? 'Deseleccionar todas' : 'Seleccionar pendientes y vencidas'}
                    </button>
                ): <div />}

                {onPay && selectedIds.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                        <Button variant="primary" onClick={() => onPay(selectedIds)}>
                            Pagar seleccionadas ({selectedIds.length})
                        </Button>
                    </div>
                )}
            </div>

            <Table
                columns={columns}
                data={fees}
                keyExtractor={(fee) => fee.id}
                onRowClick={onRowClick}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    )
}