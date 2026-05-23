import { EventsTable } from '../../components/events/EventsTable';

export default function EventsPage() {
    return <EventsTable onlyMine={false} />
}