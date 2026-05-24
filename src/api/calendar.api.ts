import apiClient from './client';

export interface CalendarFee {
    id: number
    period: string
    status: string
    price: number
}

export interface CalendarLoan {
    id: number
    startDate: string
    endDate: string
    gameName: string
    status: string
}

export interface CalendarEvent {
    id: number
    title: string
    dateTime: string
    gameName: string | null
    status: string
}

export interface CalendarData {
    fees: CalendarFee[]
    loans: CalendarLoan[]
    events: CalendarEvent[]
}

export const calendarApi = {
    getData: (userId: number, year: number, month: number) =>
        apiClient.get<CalendarData>('/calendar', { params: { userId, year, month } }).then((r) => r.data),
}