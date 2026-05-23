import { useEffect, useState } from 'react'
import { membershipFeesApi } from '../../api/membership-fees.api.ts'
import { FeeTable } from './FeeTable.tsx'
import { FeeDetailModal } from './FeeDetailModal.tsx'
import { PaymentModal } from '../payments/PaymentModal.tsx'
import type { MembershipFeeDto, MembershipFeeStatus } from '../../types'
import {Button} from "../../components/ui/Button.tsx";
import {GenerateFeesModal} from "./GenerateFeesModal.tsx";

export default function FeesPage() {
    const [fees, setFees] = useState<MembershipFeeDto[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [selectedFee, setSelectedFee] = useState<MembershipFeeDto | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [paymentFees, setPaymentFees] = useState<MembershipFeeDto[]>([])
    const [selectedFeeIds, setSelectedFeeIds] = useState<number[]>([])

    const [generateOpen, setGenerateOpen] = useState(false)

    const [filterStatus, setFilterStatus] = useState<string>('PENDING')
    const [filterPeriod, setFilterPeriod] = useState('')
    const [filterUserName, setFilterUserName] = useState('')

    const [resetSelection, setResetSelection] = useState(false)

    const limit = 10

    function loadFees() {
        membershipFeesApi.getAll({
            userName: filterUserName || undefined,
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
    }, [page, filterStatus, filterPeriod, filterUserName])

    async function handleStatusChange(ids: number[], status: MembershipFeeStatus) {
        await membershipFeesApi.updateStatus(ids, status)
        loadFees()
    }

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        fontSize: '0.875rem',
        outline: 'none',
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <input
                        style={inputStyle}
                        placeholder="Buscar por nombre..."
                        value={filterUserName}
                        onChange={(e) => { setFilterUserName(e.target.value); setPage(1) }}
                    />
                    <input
                        style={inputStyle}
                        placeholder="Periodo (ej: 2026-01)"
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
                        <Button variant="secondary" onClick={() => {
                            const selected = fees.filter((f) => selectedFeeIds.includes(f.id))
                            setPaymentFees(selected)
                            setPaymentOpen(true)
                        }}>
                            Pagar seleccionadas ({selectedFeeIds.length})
                        </Button>
                    )}
                    <Button variant="primary" onClick={() => setGenerateOpen(true)}>
                        Generar cuotas
                    </Button>
                </div>
            </div>

            <FeeTable
                fees={fees}
                total={total}
                page={page}
                onPageChange={setPage}
                showUserColumn={true}
                onRowClick={(fee) => { setSelectedFee(fee); setDetailOpen(true) }}
                onSelectionChange={setSelectedFeeIds}
                resetSelection={resetSelection}
            />

            <FeeDetailModal
                fee={selectedFee}
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                onSuccess={loadFees}
                canChangeStatus={true}
                onStatusChange={handleStatusChange}
            />

            <PaymentModal
                open={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                fees={paymentFees}
                onSuccess={() => { setPaymentOpen(false); setResetSelection((prev) => !prev); loadFees() }}
            />

            <GenerateFeesModal
                open={generateOpen}
                onClose={() => setGenerateOpen(false)}
                onSuccess={loadFees}
            />
        </div>
    )
}