import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import {AppShell} from "../components/layout/AppShell.tsx";
import LoginPage from "../pages/auth/LoginPage.tsx";
import UsersPage from "../pages/users/UsersPage.tsx";
import UserDetail from "../pages/users/UserDetail.tsx";
import FeesPage from "../pages/fees/FeesPage.tsx";
import MyFeesPage from "../pages/fees/MyFeesPage.tsx";
import {config} from "../config.ts";
import PaymentsReviewPage from "../pages/payments/PaymentsReviewPage.tsx";
import BoardGamesPage from "../pages/games/BoardGamesPage.tsx";

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
                    { path: 'users/:id', element: <UserDetail /> },
                    {
                        path: 'fees',
                        element: <PrivateRoute roles={[config.roleAdmin, config.roleTreasurer]} />,
                        children: [
                            { index: true, element: <FeesPage /> },
                        ], },
                    { path: 'my-fees', element: <MyFeesPage /> },
                    {
                        path: 'payments',
                        element: <PrivateRoute roles={[config.roleAdmin, config.roleTreasurer]} />,
                        children: [
                            { index: true, element: <PaymentsReviewPage /> },
                        ],
                    },
                    { path: 'board-games', element: <BoardGamesPage /> },
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