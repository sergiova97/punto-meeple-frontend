import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import {AppShell} from "../components/layout/AppShell.tsx";
import LoginPage from "../pages/auth/LoginPage.tsx";
import UsersPage from "../pages/auth/UsersPage.tsx";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            {
                element: <AppShell />,
                children: [
                    { index: true, element: <Navigate to="/dashboard" replace /> },
                    { path: 'dashboard', element: <div>Dashboard</div> },
                    { path: 'users', element: <UsersPage /> },
                ],
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
    },
])

export function AppRouter() {
    return <RouterProvider router={router} />
}