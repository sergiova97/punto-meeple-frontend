import { EventsTable } from '../../components/events/EventsTable';
import {useSearchParams} from "react-router-dom";

export default function EventsPage() {
    const [searchParams] = useSearchParams()
    const dateFrom = searchParams.get('dateFrom') ?? ''
    const dateTo = searchParams.get('dateTo') ?? ''

    return <EventsTable onlyMine={false} initialDateFrom={dateFrom} initialDateTo={dateTo} />
}