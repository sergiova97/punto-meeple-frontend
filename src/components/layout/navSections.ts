import { faUsers } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface NavSection {
    label: string
    icon: IconDefinition
    children: { label: string; to: string }[]
}

export const NAV_SECTIONS: NavSection[] = [
    {
        label: 'Socios',
        icon: faUsers,
        children: [
            { label: 'Listado general', to: '/users' },
            { label: 'Cuotas', to: '/membership-fees' },
        ],
    },
]