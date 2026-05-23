import { useEffect, useState } from 'react'
import { membershipFeesApi } from '../../api/membership-fees.api.ts'
import { FeeTable } from '../../components/fees/FeeTable.tsx'
import { FeeDetailModal } from '../../components/fees/FeeDetailModal.tsx'
import { PaymentModal } from '../../components/payments/PaymentModal.tsx'
import { useAuthStore } from '../../store/auth.store.ts'
import type { MembershipFeeDto } from '../../types'
import {Button} from "../../components/ui/Button.tsx";

export default function MyFeesPage() {
    const [fees, setFees] = useState<MembershipFeeDto[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [selectedFee, setSelectedFee] = useState<MembershipFeeDto | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [paymentFees, setPaymentFees] = useState<MembershipFeeDto[]>([])
    const [resetSelection, setResetSelection] = useState(false)
    const [selectedFeeIds, setSelectedFeeIds] = useState<number[]>([])

    const [filterStatus, setFilterStatus] = useState('')
    const [filterPeriod, setFilterPeriod] = useState('')

    const authUser = useAuthStore((state) => state.user)
    const limit = 10

    function loadFees() {
        if (!authUser) return
        membershipFeesApi.getAll({
            userId: authUser.id,
            status: filterStatus || undefined,
            period: filterPeriod || undefined,
            page,
            limit,
        }).then((res) => {
            setFees(res.data)
            setTotal(res.total)
        })
    }

    useEffect(() => {
        loadFees()
    }, [page, filterStatus, filterPeriod])

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        fontSize: '0.875rem',
        outline: 'none',
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <input
                        style={inputStyle}
                        placeholder="Periodo (ej: 2026-1)"
                        value={filterPeriod}
                        onChange={(e) => { setFilterPeriod(e.target.value); setPage(1) }}
                    />
                    <select
                        style={inputStyle}
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="PENDING">Pendiente</option>
                        <option value="PAID">Pagada</option>
                        <option value="OVERDUE">Vencida</option>
                        <option value="IN_REVIEW">En revisión</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {selectedFeeIds.length > 0 && (
                        <Button variant="primary" onClick={() => {
                            const selected = fees.filter((f) => selectedFeeIds.includes(f.id))
                            setPaymentFees(selected)
                            setPaymentOpen(true)
                        }}>
                            Pagar seleccionadas ({selectedFeeIds.length})
                        </Button>
                    )}
                </div>
            </div>

            <FeeTable
                fees={fees}
                total={total}
                page={page}
                onPageChange={setPage}
                showUserColumn={false}
                showSelectAll={true}
                onRowClick={(fee) => { setSelectedFee(fee); setDetailOpen(true) }}
                onSelectionChange={setSelectedFeeIds}
                resetSelection={resetSelection}
            />

            <FeeDetailModal
                fee={selectedFee}
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                onSuccess={loadFees}
                canPay={true}
            />

            <PaymentModal
                open={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                fees={paymentFees}
                onSuccess={() => { setPaymentOpen(false); setResetSelection((prev) => !prev); loadFees() }}
            />
        </div>
    )
}