import { useEffect, useState } from 'react'
import { membershipFeesApi } from '../../api/membership-fees.api'
import { FeeTable } from './FeeTable.tsx'
import { FeeDetailModal } from './FeeDetailModal.tsx'
import { PaymentModal } from './PaymentModal.tsx'
import { useAuthStore } from '../../store/auth.store'
import type { MembershipFeeDto } from '../../types'

export default function MyFeesPage() {
    const [fees, setFees] = useState<MembershipFeeDto[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [selectedFee, setSelectedFee] = useState<MembershipFeeDto | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [paymentIds, setPaymentIds] = useState<number[]>([])

    const authUser = useAuthStore((state) => state.user)
    const limit = 10

    function loadFees() {
        if (!authUser) return
        membershipFeesApi.getAll({
            userId: authUser.id,
            page,
            limit,
        }).then((res) => {
            setFees(res.data)
            setTotal(res.total)
        })
    }

    useEffect(() => {
        loadFees()
    }, [page])

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1>Mis cuotas</h1>
            </div>

            <FeeTable
                fees={fees}
                total={total}
                page={page}
                onPageChange={setPage}
                showUserColumn={false}
                onRowClick={(fee) => { setSelectedFee(fee); setDetailOpen(true) }}
                onPay={(ids) => { setPaymentIds(ids); setPaymentOpen(true) }}
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
                feeIds={paymentIds}
                onSuccess={() => { setPaymentOpen(false); loadFees() }}
            />
        </div>
    )
}