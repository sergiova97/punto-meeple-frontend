import {faChessBoard, faMoneyBill, faUsers} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {config} from "../../config.ts";

export interface NavChild {
    label: string
    to: string
    roles?: string[]
}

export interface NavSection {
    label: string
    icon: IconDefinition
    children: NavChild[]
    roles?: string[]
}

export const NAV_SECTIONS: NavSection[] = [
    {
        label: 'Socios',
        icon: faUsers,
        children: [
            { label: 'Listado general', to: '/users' },
        ],
    },
    {
        label: 'Cuotas',
        icon: faMoneyBill,
        children: [
            { label: 'Mis cuotas', to: '/my-fees' },
            { label: 'Todas las cuotas', to: '/fees', roles: [config.roleAdmin, config.roleTreasurer] },
            { label: 'Pagos pendientes de revisión', to: '/payments', roles: [config.roleAdmin, config.roleTreasurer] },
        ],
    },
    {
        label: 'Biblioteca',
        icon: faChessBoard,
        children: [
            { label: 'Juegos de mesa', to: '/board-games' },
            { label: 'Libros de rol', to: '/rpg-books' },
            { label: 'Categorías y mecánicas', to: '/game-settings', roles: [config.roleAdmin, config.roleLibrarian] },
        ],
    },
]