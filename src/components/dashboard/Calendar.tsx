import { useEffect, useState } from 'react'
import { calendarApi, type CalendarData, type CalendarFee, type CalendarLoan, type CalendarEvent } from '../../api/calendar.api'
import { useAuthStore } from '../../store/auth.store'
import type {EventDto, LoanDto, MembershipFeeDto} from "../../types";
import {FeeDetailModal} from "../fees/FeeDetailModal.tsx";
import {EventDetailModal} from "../events/EventDetailModal.tsx";
import {membershipFeesApi} from "../../api/membership-fees.api.ts";
import {loansApi} from "../../api/loans.api.ts";
import {eventsApi} from "../../api/events.api.ts";
import {LoanDetailModal} from "../loans/LoanDetailModal.tsx";

const FEE_COLORS: Record<string, string> = {
    PAID:      '#10B981',
    PENDING:   '#F59E0B',
    OVERDUE:   '#EF4444',
    IN_REVIEW: '#3B82F6',
}

const LOAN_COLORS: Record<string, string> = {
    ACTIVE:   '#8B5CF6',
    PENDING:  '#A78BFA',
    OVERDUE:  '#F97316',
    RETURNED: '#9CA3AF',
}

const EVENT_COLORS: Record<string, string> = {
    OPEN:      '#06B6D4',
    FULL:      '#D97706',
    CANCELLED: '#EF4444',
    FINISHED:  '#9CA3AF',
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month - 1, 1).getDay()
    return day === 0 ? 6 : day - 1
}

interface DayItem {
    type: 'fee' | 'loan' | 'event'
    color: string
    label: string
    id: number
    data: CalendarFee | CalendarLoan | CalendarEvent
}

function getItemsForDay(day: number, year: number, month: number, data: CalendarData): DayItem[] {
    const items: DayItem[] = []
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    const period = `${year}-${String(month).padStart(2, '0')}`
    data.fees.forEach((f) => {
        if (f.period === period && day === 28) {
            items.push({ type: 'fee', color: FEE_COLORS[f.status] ?? '#9CA3AF', label: `Cuota - ${f.status}`, id: f.id, data: f })
        }
    })

    data.loans.forEach((l) => {
        if (dateStr >= l.startDate && dateStr <= l.endDate) {
            items.push({ type: 'loan', color: LOAN_COLORS[l.status] ?? '#9CA3AF', label: l.gameName, id: l.id, data: l })
        }
    })

    data.events.forEach((e) => {
        const eventDate = e.dateTime.split('T')[0]
        if (eventDate === dateStr) {
            items.push({type: 'event', color: EVENT_COLORS[e.status] ?? '#9CA3AF', label: e.title, id: e.id, data: e})
        }
    })

    return items
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function Calendar() {
    const authUser = useAuthStore((state) => state.user)
    const today = new Date()
    const [year, setYear] = useState(today.getFullYear())
    const [month, setMonth] = useState(today.getMonth() + 1)
    const [data, setData] = useState<CalendarData>({ fees: [], loans: [], events: [] })
    const [hoveredDay, setHoveredDay] = useState<number | null>(null)
    const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

    const [selectedFee, setSelectedFee] = useState<MembershipFeeDto | null>(null)
    const [feeModalOpen, setFeeModalOpen] = useState(false)
    const [selectedLoan, setSelectedLoan] = useState<LoanDto | null>(null)
    const [loanModalOpen, setLoanModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null)
    const [eventModalOpen, setEventModalOpen] = useState(false)

    useEffect(() => {
        if (!authUser) return
        calendarApi.getData(authUser.id, year, month).then(setData)
    }, [authUser, year, month])

    useEffect(() => {
        if (year === today.getFullYear() && month === today.getMonth() + 1) {
            setSelectedDay(today.getDate())
        } else {
            setSelectedDay(null)
        }
    }, [year, month])

    async function handleItemClick(item: DayItem) {
        if (item.type === 'fee') {
            const fee = await membershipFeesApi.getById(item.id)
            setSelectedFee(fee)
            setFeeModalOpen(true)
        } else if (item.type === 'loan') {
            const loan = await loansApi.getById(item.id)
            setSelectedLoan(loan)
            setLoanModalOpen(true)
        } else if (item.type === 'event') {
            const event = await eventsApi.getById(item.id)
            setSelectedEvent(event)
            setEventModalOpen(true)
        }
    }

    function prevMonth() {
        if (month === 1) { setYear(y => y - 1); setMonth(12) }
        else setMonth(m => m - 1)
    }

    function nextMonth() {
        if (month === 12) { setYear(y => y + 1); setMonth(1) }
        else setMonth(m => m + 1)
    }

    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    return (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)', padding: '4px 8px' }}>‹</button>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {MONTHS[month - 1]} {year}
                </span>
                <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)', padding: '4px 8px' }}>›</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
                {DAYS.map((d) => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '4px' }}>
                        {d}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', position: 'relative' }}>
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const items = getItemsForDay(day, year, month, data)
                    const isToday = day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear()
                    const isHovered = hoveredDay === day
                    const hasItems = items.length > 0

                    const bgSections = items.map((item) => item.color)

                    return (
                        <div
                            key={day}
                            onClick={() => hasItems && setSelectedDay(day === selectedDay ? null : day)}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            style={{
                                position: 'relative',
                                borderRadius: '8px',

                                cursor: hasItems ? 'pointer' : 'default',
                                border: isToday && selectedDay !== day
                                    ? '2px solid var(--color-primary)'
                                    : selectedDay === day
                                        ? '2px solid var(--color-highlight)'
                                        : '2px solid transparent',
                                transition: 'transform 0.1s ease',
                                transform: isHovered && hasItems ? 'scale(1.05)' : 'scale(1)',
                            }}
                        >
                            {bgSections.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: bgSections.length === 1
                                        ? bgSections[0]
                                        : `linear-gradient(to right, ${bgSections.map((c, i) => `${c} ${(i / bgSections.length) * 100}%, ${c} ${((i + 1) / bgSections.length) * 100}%`).join(', ')})`,
                                    opacity: 0.25,
                                }} />
                            )}

                            <div style={{
                                position: 'relative',
                                textAlign: 'center',
                                padding: '8px 4px',
                                fontSize: '0.85rem',
                                fontWeight: isToday ? 700 : 400,
                                color: isToday ? 'var(--color-primary)' : 'var(--text-primary)',
                            }}>
                                {day}
                            </div>
                        </div>
                    )
                })}
            </div>

            {selectedDay !== null && (() => {
                const items = getItemsForDay(selectedDay, year, month, data)
                const dateLabel = `${String(selectedDay).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
                return (
                    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                        <p style={{ textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                            {dateLabel}
                        </p>
                        {items.length === 0 ? (
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sin sucesos este día</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleItemClick(item)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            color: 'var(--text-primary)',
                                            background: 'var(--bg-app)',
                                            border: '1px solid var(--border)',
                                            transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-secondary)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-app)')}
                                    >
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })()}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                {[
                    { color: '#F59E0B', label: 'Cuota pendiente' },
                    { color: '#10B981', label: 'Cuota pagada' },
                    { color: '#EF4444', label: 'Cuota vencida' },
                    { color: '#8B5CF6', label: 'Préstamo activo' },
                    { color: '#06B6D4', label: 'Evento' },
                ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                        {item.label}
                    </div>
                ))}
            </div>

            <FeeDetailModal
                fee={selectedFee}
                open={feeModalOpen}
                onClose={() => { setFeeModalOpen(false); setSelectedFee(null) }}
                onSuccess={() => calendarApi.getData(authUser!.id, year, month).then(setData)}
                canPay={true}
            />

            <EventDetailModal
                event={selectedEvent}
                open={eventModalOpen}
                onClose={() => { setEventModalOpen(false); setSelectedEvent(null) }}
            />

            <LoanDetailModal
                loan={selectedLoan}
                open={loanModalOpen}
                onClose={() => { setLoanModalOpen(false); setSelectedLoan(null) }}
            />
        </div>
    )
}