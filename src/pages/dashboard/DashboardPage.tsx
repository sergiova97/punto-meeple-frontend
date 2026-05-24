import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { Calendar } from '../../components/dashboard/Calendar'
import { paymentsApi } from '../../api/payments.api'
import { membershipFeesApi } from '../../api/membership-fees.api'
import { loansApi } from '../../api/loans.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowRight, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons'
import {config} from "../../config.ts";
import type {EventDto, EventStatus, LoanDto} from "../../types";
import {LoanDetailModal} from "../../components/loans/LoanDetailModal.tsx";
import {eventsApi} from "../../api/events.api.ts";
import {Badge} from "../../components/ui/Badge.tsx";
import {Pagination} from "../../components/ui/Pagination.tsx";
import {Table} from "../../components/ui/Table.tsx";

const STATUS_BADGE: Record<EventStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    OPEN:      { label: 'Abierto',    variant: 'success' },
    FULL:      { label: 'Completo',   variant: 'warning' },
    CANCELLED: { label: 'Cancelado',  variant: 'danger' },
    FINISHED:  { label: 'Finalizado', variant: 'neutral' },
}

const eventColumns = [
    {
        label: 'Título',
        render: (e: EventDto) => e.title,
    },
    {
        label: 'Juego',
        render: (e: EventDto) => e.gameName ?? '—',
    },
    {
        label: 'Fecha',
        render: (e: EventDto) => new Date(e.dateTime).toLocaleString('es-ES', {
            day: '2-digit', month: 'short',
            hour: '2-digit', minute: '2-digit',
        }),
    },
    {
        label: 'Jugadores',
        render: (e: EventDto) => `${e.participantCount} / ${e.maxPlayers}`,
    },
    {
        label: 'Estado',
        render: (e: EventDto) => {
            const { label, variant } = STATUS_BADGE[e.status]
            return <Badge variant={variant}>{label}</Badge>
        },
    },
]


interface Notification {
    message: string
    to?: string
    loan?: LoanDto
    color?: string
}

export default function DashboardPage() {
    const authUser = useAuthStore((state) => state.user)
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [selectedLoan, setSelectedLoan] = useState<LoanDto | null>(null)
    const [loanModalOpen, setLoanModalOpen] = useState(false)

    const [upcomingEvents, setUpcomingEvents] = useState<EventDto[]>([])
    const [eventsTotal, setEventsTotal] = useState(0)
    const [eventsPage, setEventsPage] = useState(1)
    const eventsLimit = 5

    const isAdmin = authUser?.roles.some((r) => r.name === config.roleAdmin)
    const isTreasurer = authUser?.roles.some((r) => r.name === config.roleTreasurer)
    const isLibrarian = authUser?.roles.some((r) => r.name === config.roleLibrarian)

    async function loadNotifications() {
        const notifs: Notification[] = []
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0]

        if (isAdmin || isTreasurer) {
            const payments = await paymentsApi.getAll({ status: 'IN_REVIEW', limit: 1 })
            if (payments.total > 0) {
                notifs.push({
                    message: `Tienes ${payments.total} pago${payments.total > 1 ? 's' : ''} pendiente${payments.total > 1 ? 's' : ''} de revisión`,
                    to: '/payments',
                })
            }

            const fees = await membershipFeesApi.getAll({ status: 'OVERDUE', limit: 1 })
            if (fees.total > 0) {
                notifs.push({
                    message: `Hay ${fees.total} cuota${fees.total > 1 ? 's' : ''} vencida${fees.total > 1 ? 's' : ''} sin pagar`,
                    to: '/fees',
                })
            }
        }

        if (isAdmin || isLibrarian) {
            const loans = await loansApi.getAll({ status: 'OVERDUE', limit: 1 })
            if (loans.total > 0) {
                notifs.push({
                    message: `Hay ${loans.total} préstamo${loans.total > 1 ? 's' : ''} no devuelto${loans.total > 1 ? 's' : ''}`,
                    to: '/loans',
                })
            }
        }

        if (authUser) {
            const currentPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

            const overdueFees = await membershipFeesApi.getAll({ userId: authUser.id, status: 'OVERDUE', limit: 1 })
            if (overdueFees.total > 0) {
                notifs.push({
                    message: `Tienes ${overdueFees.total} cuota${overdueFees.total > 1 ? 's' : ''} vencida${overdueFees.total > 1 ? 's' : ''} sin pagar`,
                    to: '/my-fees',
                })
            }

            const pendingFees = await membershipFeesApi.getAll({ userId: authUser.id, status: 'PENDING', period: currentPeriod, limit: 1 })
            if (pendingFees.total > 0) {
                notifs.push({
                    message: 'Tienes la cuota de este mes pendiente de pago',
                    to: '/my-fees',
                })
            }

            const myLoans = await loansApi.getAll({ userId: authUser.id, limit: 100 })

            myLoans.data.forEach((loan) => {
                if (loan.status === 'PENDING' && loan.startDate <= todayStr) {
                    notifs.push({
                        message: `Has retirado "${loan.gameName}" de la biblioteca? Actualiza el estado del préstamo a Activo`,
                        loan,
                        color: '#fef3c7',
                    })
                }

                if (loan.status === 'ACTIVE') {
                    const endDate = new Date(loan.endDate)
                    const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    if (diffDays <= 3 && diffDays >= 0) {
                        notifs.push({
                            message: `"${loan.gameName}" debe devolverse en ${diffDays} día${diffDays !== 1 ? 's' : ''}`,
                            loan,
                            color: '#fef3c7',
                        })
                    }
                }

                if (loan.status === 'OVERDUE') {
                    notifs.push({
                        message: `El préstamo de "${loan.gameName}" está vencido, ¡toca devolverlo!`,
                        loan,
                        color: '#fee2e2',
                    })
                }
            })
        }

        setNotifications(notifs)
    }

    function getNextSevenDays() {
        const today = new Date()
        const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        return {
            dateFrom: today.toISOString().split('T')[0],
            dateTo: in7Days.toISOString().split('T')[0],
        }
    }

    useEffect(() => {
        const { dateFrom, dateTo } = getNextSevenDays()
        eventsApi.getAll({ dateFrom, dateTo, page: eventsPage, limit: eventsLimit })
            .then((res) => {
                setUpcomingEvents(res.data)
                setEventsTotal(res.total)
            })
    }, [eventsPage])

    useEffect(() => {
        loadNotifications()
    }, [authUser])

    function handleNotifClick(notif: Notification) {
        if (notif.loan) {
            setSelectedLoan(notif.loan)
            setLoanModalOpen(true)
        } else if (notif.to) {
            navigate(notif.to)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {notifications.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map((notif, i) => (
                        <div
                            key={i}
                            onClick={() => handleNotifClick(notif)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                background: notif.color ?? '#fef3c7',
                                border: `1px solid ${notif.color === '#fee2e2' ? '#fca5a5' : '#fcd34d'}`,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                            <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: notif.color === '#fee2e2' ? '#dc2626' : '#d97706', width: '16px', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: notif.color === '#fee2e2' ? '#991b1b' : '#92400e' }}>{notif.message}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="dashboard-grid">
                <Calendar />

                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            Eventos próximos (7 días)
                        </h2>
                        <span
                            onClick={() => {
                                const { dateFrom, dateTo } = getNextSevenDays()
                                navigate(`/events?dateFrom=${dateFrom}&dateTo=${dateTo}`)
                            }}
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 500,
                            }}
                        >
                            Ver todos <FontAwesomeIcon icon={faArrowRight} style={{ width: '12px' }} />
                        </span>
                    </div>

                    {upcomingEvents.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
                            No hay eventos en los próximos 7 días
                        </p>
                    ) : (
                        <>
                            <Table
                                columns={eventColumns}
                                data={upcomingEvents}
                                keyExtractor={(e) => e.id}
                            />
                            {eventsTotal > eventsLimit && (
                                <Pagination
                                    page={eventsPage}
                                    totalPages={Math.ceil(eventsTotal / eventsLimit)}
                                    onPageChange={setEventsPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            <LoanDetailModal
                loan={selectedLoan}
                open={loanModalOpen}
                onClose={() => { setLoanModalOpen(false); setSelectedLoan(null) }}
                onSuccess={loadNotifications}
            />
        </div>
    )
}