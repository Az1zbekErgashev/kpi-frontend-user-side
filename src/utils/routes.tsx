import { MonthlyValue } from 'components/MonthlyValue';
import DefaultLayout from 'layouts/DefaultLayout';
import { Login, TeamMembers, RoleBasedGoals, UserGoal, TeamPerformance, MemberPerformance, Profile } from 'pages';
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
          <TeamMembers />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/goal/team-leader/:year',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="goal_setting">
          <RoleBasedGoals />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/goal/user/:year',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="goal_setting">
          <RoleBasedGoals />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/goal/member/:id/:year',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="goal_setting">
          <UserGoal />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/goal/user-performance/:month/:year',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="team_member_performance">
          <MonthlyValue />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/goal/member-performance/:id/:month/:year',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="member_performance">
          <MemberPerformance />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/goal/team-performance/:month/:year',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="team_performance">
          <TeamPerformance />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedUserRoute>
        <DefaultLayout title="user_profile">
          <Profile />
        </DefaultLayout>
      </ProtectedUserRoute>
    ),
  },
]);
