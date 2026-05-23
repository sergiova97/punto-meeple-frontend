import { useEffect, useState } from 'react'
import { paymentsApi } from '../../api/payments.api'
import { Table } from '../../components/ui/Table'
import { Pagination } from '../../components/ui/Pagination'
import { Badge } from '../../components/ui/Badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import type { PaymentDto } from '../../types'
import {PaymentDetailModal} from "./PaymentDetalModal.tsx"

const STATUS_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    IN_REVIEW: { label: 'En revisión', variant: 'info' },
    ACCEPTED:  { label: 'Aceptado',    variant: 'success' },
    DENIED:    { label: 'Denegado',    variant: 'danger' },
}

export default function PaymentsReviewPage() {
    const [payments, setPayments] = useState<PaymentDto[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)

    const [filterStatus, setFilterStatus] = useState('IN_REVIEW')
    const [filterReference, setFilterReference] = useState('')

    const limit = 10

    function loadPayments() {
        paymentsApi.getAll({
            status: filterStatus || undefined,
            reference: filterReference || undefined,
            page,
            limit,
        }).then((res) => {
            setPayments(res.data)
            setTotal(res.total)
        })
    }

    useEffect(() => {
        loadPayments()
    }, [page, filterStatus, filterReference])

    async function handleAccept(id: number) {
        if (!window.confirm('¿Seguro que quieres aprobar este pago?')) return
        await paymentsApi.accept(id)
        loadPayments()
    }

    async function handleDeny(id: number) {
        if (!window.confirm('¿Seguro que quieres denegar este pago?')) return
        await paymentsApi.deny(id)
        loadPayments()
    }

    const columns = [
        { label: 'Socio', render: (p: PaymentDto) => p.userName },
        { label: 'Importe', render: (p: PaymentDto) => `${p.amount.toFixed(2)} €` },
        { label: 'Método', render: (p: PaymentDto) => p.method },
        { label: 'Referencia', render: (p: PaymentDto) => p.reference },
        {
            label: 'Estado',
            render: (p: PaymentDto) => {
                const { label, variant } = STATUS_BADGE[p.status]
                return <Badge variant={variant}>{label}</Badge>
            },
        },
        {
            label: 'Acciones',
            render: (p: PaymentDto) => (
                <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    {p.status === 'IN_REVIEW' && (
                        <>
                            <button
                                onClick={() => handleAccept(p.id)}
                                title="Aprobar"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-success)',
                                    padding: '4px',
                                }}
                            >
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button
                                onClick={() => handleDeny(p.id)}
                                title="Denegar"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-error)',
                                    padding: '4px',
                                }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ]

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
                <h1>Revisión de pagos</h1>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input
                    style={inputStyle}
                    placeholder="Referencia..."
                    value={filterReference}
                    onChange={(e) => { setFilterReference(e.target.value); setPage(1) }}
                />
                <select
                    style={inputStyle}
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
                >
                    <option value="">Todos los estados</option>
                    <option value="IN_REVIEW">En revisión</option>
                    <option value="ACCEPTED">Aceptado</option>
                    <option value="DENIED">Denegado</option>
                </select>
            </div>

            <Table
                columns={columns}
                data={payments}
                keyExtractor={(p) => p.id}
                onRowClick={(p) => { setSelectedPayment(p); setDetailOpen(true) }}
            />

            <Pagination
                page={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={setPage}
            />

            <PaymentDetailModal
                payment={selectedPayment}
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                onSuccess={loadPayments}
            />
        </div>


    )
}