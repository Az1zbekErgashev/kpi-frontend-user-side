import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';
import { useUser } from './useUserState';

interface initialQuery {
  name?: string;
  IsDeleted?: string | number;
  pageIndex: number;
  pageSize: number;
  year?: number;
}
export function useGoal() {
  const [queryParams, setQueryParams] = useState<initialQuery | null>({ pageIndex: 1, pageSize: 10 });
  const [goal, setGoal] = useState<any>();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useUser();
  const { data: ceoGoal } = useQueryApiClient({
    request: {
      url: `/api/goal/ceo-goal/${params.year || queryParams?.year}`,
      method: 'GET',
      disableOnMount: user?.role == 'TeamLeader' ? false : true,
    },
  });

  const { appendData: createGoalFromTeam } = useQueryApiClient({
    request: {
      url: '/api/goal/create-from-team',
      method: 'POST',
    },
  });

  const { appendData: updateGoal } = useQueryApiClient({
    request: {
      url: '/api/goal/update',
      method: 'PUT',
    },
  });

  const { data: teamMeambers } = useQueryApiClient({
    request: {
      url: '/api/user/filter-teams',
      method: 'GET',
    },
  });

  const { data: teamLeaders } = useQueryApiClient({
    request: {
      url: '/api/user/team-leader',
      method: 'GET',
      disableOnMount: user?.role == 'TeamLeader' ? false : true,
    },
  });

  const { data: teamAndRoom } = useQueryApiClient({
    request: {
      url: '/api/goal/team-by-token',
      method: 'GET',
    },
  });

  const {} = useQueryApiClient({
    request: {
      url: `/api/goal/by-user/${params.id}/${params.year || queryParams?.year}`,
      method: 'GET',
    },
    onSuccess: (response) => {
      setGoal(response.data);
    },
    onError: (error) => {
      if (error.error === 'user_not_found') {
        navigate('/', { replace: true });
      }
    },
  });

  return {
    setQueryParams,
    ceoGoal,
    updateGoal,
    createGoalFromTeam,
    teamMeambers,
    teamLeaders,
    teamAndRoom,
    goal,
  };
}
