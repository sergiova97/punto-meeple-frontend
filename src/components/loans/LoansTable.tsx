import { useEffect, useState } from 'react';
import { loansApi } from '../../api/loans.api';
import { Table } from '../ui/Table';
import { Pagination } from '../ui/Pagination';
import { Badge } from '../ui/Badge';
import type { LoanDto, LoanStatus } from '../../types';
import {useAuthStore} from "../../store/auth.store.ts";

const STATUS_BADGE: Record<LoanStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    PENDING:  { label: 'Pendiente', variant: 'warning' },
    ACTIVE:   { label: 'Activo',    variant: 'success' },
    RETURNED: { label: 'Devuelto',  variant: 'neutral' },
    OVERDUE:  { label: 'Vencido',   variant: 'danger' },
}

interface LoansTableProps {
    userId?: number
    showUserColumn?: boolean
    showActions?: boolean
}

export function LoansTable({ userId, showUserColumn = true, showActions = false }: LoansTableProps) {
    const authUser = useAuthStore((state) => state.user)

    const [loans, setLoans] = useState<LoanDto[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [filterGameName, setFilterGameName] = useState('')
    const [filterUserName, setFilterUserName] = useState('')
    const [filterStartDate, setFilterStartDate] = useState('')
    const [filterEndDate, setFilterEndDate] = useState('')
    const [filterStatus, setFilterStatus] = useState('')

    const limit = 10

    function loadLoans() {
        loansApi.getAll({
            userId,
            gameName: filterGameName || undefined,
            userName: filterUserName || undefined,
            startDate: filterStartDate || undefined,
            endDate: filterEndDate || undefined,
            status: filterStatus || undefined,
            page,
            limit,
        }).then((res) => {
            setLoans(res.data)
            setTotal(res.total)
        })
    }

    useEffect(() => {
        loadLoans()
    }, [page, filterStatus, filterStartDate, filterEndDate])

    async function handleStatusChange(id: number, status: LoanStatus) {
        if (!authUser) return
        if (!window.confirm(`¿Seguro que quieres cambiar el estado a ${STATUS_BADGE[status].label}?`)) return
        await loansApi.updateStatus(id, status, authUser.id)
        loadLoans()
    }

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        fontSize: '0.875rem',
        outline: 'none',
    }

    const columns = [
        ...(showUserColumn ? [{ label: 'Socio', render: (l: LoanDto) => l.userName }] : []),
        { label: 'Juego', render: (l: LoanDto) => l.gameName },
        { label: 'Inicio', render: (l: LoanDto) => l.startDate },
        { label: 'Fin', render: (l: LoanDto) => l.endDate },
        { label: 'Devolución', render: (l: LoanDto) => l.returnDate ?? '—' },
        {
            label: 'Estado',
            render: (l: LoanDto) => {
                const { label, variant } = STATUS_BADGE[l.status]
                return <Badge variant={variant}>{label}</Badge>
            },
        },
        ...(showActions ? [{
            label: 'Acciones',
            render: (l: LoanDto) => (
                <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                    {l.status === 'PENDING' && (
                        <button onClick={() => handleStatusChange(l.id, 'ACTIVE')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
                            Activar
                        </button>
                    )}
                    {(l.status === 'ACTIVE' || l.status === 'OVERDUE') && (
                        <button onClick={() => handleStatusChange(l.id, 'RETURNED')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                            Devuelto
                        </button>
                    )}
                    {l.status === 'PENDING' && (
                        <button onClick={() => handleStatusChange(l.id, 'RETURNED')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-error)', fontWeight: 600 }}>
                            Cancelar
                        </button>
                    )}
                </div>
            ),
        }] : []),
    ]

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
                <input style={inputStyle} placeholder="Juego..." value={filterGameName}
                       onChange={(e) => setFilterGameName(e.target.value)}
                       onBlur={() => setPage(1)}
                       onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); loadLoans() } }}
                />
                {showUserColumn && (
                    <input style={inputStyle} placeholder="Socio..." value={filterUserName}
                           onChange={(e) => setFilterUserName(e.target.value)}
                           onBlur={() => setPage(1)}
                           onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); loadLoans() } }}
                    />
                )}
                <input style={inputStyle} type="date" value={filterStartDate} onChange={(e) => { setFilterStartDate(e.target.value); setPage(1) }} />
                <input style={inputStyle} type="date" value={filterEndDate} onChange={(e) => { setFilterEndDate(e.target.value); setPage(1) }} />
                <select style={inputStyle} value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}>
                    <option value="">Todos los estados</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="ACTIVE">Activo</option>
                    <option value="RETURNED">Devuelto</option>
                    <option value="OVERDUE">Vencido</option>
                </select>
            </div>

            <Table columns={columns} data={loans} keyExtractor={(l) => l.id} />

            <Pagination page={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
        </div>
    )
}