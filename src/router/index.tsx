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
import RpgBooksPage from "../pages/games/RpgBooksPage.tsx";
import GameSettingsPage from "../pages/games/GameSettingsPage.tsx";
import LoansPage from "../pages/loans/LoansPage.tsx";
import MyLoansPage from "../pages/loans/MyLoansPage.tsx";
import EventsPage from "../pages/events/EventsPage.tsx";
import MyEventsPage from "../pages/events/MyEventsPage.tsx";

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
                    { path: 'rpg-books', element: <RpgBooksPage /> },
                    { path: 'loans', element: <LoansPage /> },
                    { path: 'my-loans', element: <MyLoansPage /> },
                    {
                        path: 'game-settings',
                        element: <PrivateRoute roles={[config.roleAdmin, config.roleLibrarian]} />,
                        children: [
                            { index: true, element: <GameSettingsPage /> },
                        ],
                    },
                    { path: 'events', element: <EventsPage /> },
                    { path: 'my-events', element: <MyEventsPage /> },
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