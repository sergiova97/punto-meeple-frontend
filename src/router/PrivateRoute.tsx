import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

interface PrivateRouteProps {
    roles?: string[]
}

export function PrivateRoute({ roles } : PrivateRouteProps) {
    const { isAuthenticated, user } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (roles && roles.length > 0) {
        const userRoles = user?.roles.map((r) => r.name) ?? []
        const hasAccess = roles.some((r) => userRoles.includes(r))
        if (!hasAccess) {
            return <Navigate to="/dashboard" replace />
        }
    }

    return <Outlet />
}