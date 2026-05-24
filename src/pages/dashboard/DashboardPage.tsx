import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { Calendar } from '../../components/dashboard/Calendar'
import { paymentsApi } from '../../api/payments.api'
import { membershipFeesApi } from '../../api/membership-fees.api'
import { loansApi } from '../../api/loans.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import {config} from "../../config.ts";

interface Notification {
    message: string
    to: string
    params?: Record<string, string>
}

export default function DashboardPage() {
    const authUser = useAuthStore((state) => state.user)
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState<Notification[]>([])

    const isAdmin = authUser?.roles.some((r) => r.name === config.roleAdmin)
    const isTreasurer = authUser?.roles.some((r) => r.name === config.roleTreasurer)
    const isLibrarian = authUser?.roles.some((r) => r.name === config.roleLibrarian)

    useEffect(() => {
        const notifs: Notification[] = []

        async function loadNotifications() {
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
                const today = new Date()
                const currentPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

                const overdueFees = await membershipFeesApi.getAll({
                    userId: authUser.id,
                    status: 'OVERDUE',
                    limit: 1,
                })
                if (overdueFees.total > 0) {
                    notifs.push({
                        message: `Tienes ${overdueFees.total} cuota${overdueFees.total > 1 ? 's' : ''} vencida${overdueFees.total > 1 ? 's' : ''} sin pagar`,
                        to: '/my-fees',
                    })
                }

                const pendingFees = await membershipFeesApi.getAll({
                    userId: authUser.id,
                    status: 'PENDING',
                    period: currentPeriod,
                    limit: 1,
                })
                if (pendingFees.total > 0) {
                    notifs.push({
                        message: 'Tienes la cuenta del mes pendiente de pago',
                        to: '/my-fees',
                    })
                }
            }

            setNotifications(notifs)
        }

        loadNotifications()
    }, [authUser])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {notifications.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map((notif, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(notif.to)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                background: '#fef3c7',
                                border: '1px solid #fcd34d',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#fde68a')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#fef3c7')}
                        >
                            <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#d97706', width: '16px', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#92400e' }}>{notif.message}</span>
                        </div>
                    ))}
                </div>
            )}

            <Calendar />

        </div>
    )
}