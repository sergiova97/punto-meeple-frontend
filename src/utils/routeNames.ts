export const ROUTE_NAMES: Record<string, string> = {
    '/dashboard':  'Dashboard',
    '/users':      'Socios',
    '/fees':       'Cuotas',
    '/my-fees':    'Mis cuotas',
    '/payments':   'Revisión de pagos',
}

export function getRouteName(pathname: string): string {
    return ROUTE_NAMES[pathname] ?? ''
}