import { useState } from 'react';
import { useParams } from 'react-router-dom';
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

  return {
    setQueryParams,
    ceoGoal,
    updateGoal,
    createGoalFromTeam,
    teamMeambers,
    teamLeaders,
  };
}
