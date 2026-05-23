import { EventsTable } from '../../components/events/EventsTable';

export default function MyEventsPage() {
    return <EventsTable onlyMine={true} />
}