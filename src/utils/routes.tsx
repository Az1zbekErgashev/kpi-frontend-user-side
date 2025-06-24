import DefaultLayout from 'layouts/DefaultLayout';
import { HomePage, Login, TeamLeaders, GoalPage, GoalByUser } from 'pages';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedUserRoute from 'routes/ProtectedUserRoutes';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="team_leaders">
          <TeamLeaders />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/goal/user-id/:id/:year',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="goal_setting">
          <GoalPage />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/goal/user/:id/:year',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="goal_setting">
          <GoalByUser />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
]);
