import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';

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

  const { data: ceoGoal } = useQueryApiClient({
    request: {
      url: `/api/goal/ceo-goal/${params.year || queryParams?.year}`,
      method: 'GET',
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

  return {
    setQueryParams,
    ceoGoal,
    updateGoal,
    createGoalFromTeam,
  };
}
