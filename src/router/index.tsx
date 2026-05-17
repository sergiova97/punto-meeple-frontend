import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <div>Login</div>,
    },
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <div>Dashboard</div> },
            { path: 'users', element: <div>Usuarios</div> },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
    },
])

export function AppRouter() {
    return <RouterProvider router={router} />
}