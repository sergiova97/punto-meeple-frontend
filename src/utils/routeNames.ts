export const ROUTE_NAMES: Record<string, string> = {
    '/dashboard':   'Dashboard',
    '/users':       'Socios',
    '/fees':        'Cuotas',
    '/my-fees':     'Mis cuotas',
    '/payments':    'Revisión de pagos',
    '/board-games': 'Juegos de mesa',
    '/rpg-books':   'Libros de rol',
    '/game-settings': 'Categorías y mecánicas',
}

export function getRouteName(pathname: string): string {
    return ROUTE_NAMES[pathname] ?? ''
}