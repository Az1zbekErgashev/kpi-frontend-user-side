import { GoalForm, GoalTable, CommentHistory } from 'components';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from 'ui';
import useQueryApiClient from 'utils/useQueryApiClient';
import { GoalCommentForCEO } from 'components/GoalCommentForCEO';

export function RoleBasedGoals() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const currentYear = dayjs().year();
  const year = new Date().getFullYear().toString();
  const selectedYear = params.year ?? year;
  const location = useLocation();
  const isTeamLeaderGoal = location.pathname.includes('/goal/team-leader') ? true : false;

  useEffect(() => {
    const paramYear = params.year;
    const parsed = parseInt(paramYear || '', 10);

    const isValidYear = !isNaN(parsed) && /^\d{4}$/.test(paramYear || '') && parsed >= 2000 && parsed <= currentYear;

    if (!isValidYear) {
      navigate('/', { replace: true });
    }
  }, [params.year]);

  const { appendData: createGoalFromTeam } = useQueryApiClient({
    request: {
      url: '/api/goal/create-from-team',
      method: 'POST',
    },
    onSuccess: () => {
      getGoalByUserId();
    },
  });

  const { appendData: updateGoal } = useQueryApiClient({
    request: {
      url: '/api/goal/update',
      method: 'PUT',
    },
    onSuccess: () => {
      getGoalByUserId();
    },
  });

  const { data: teamAndRoom } = useQueryApiClient({
    request: {
      url: '/api/goal/team-by-token',
      method: 'GET',
    },
  });

  const { data: ceoGoal } = useQueryApiClient({
    request: {
      url: isTeamLeaderGoal ? `/api/goal/ceo-goal/${params.year}` : `/api/goal/leader/${params.year}`,
      method: 'GET',
    },
    onError: () => {
      alert(t('error_fetching_ceo_goal'));
      navigate('/', { replace: true });
    },
  });

  const { refetch: getGoalByUserId, data: goal } = useQueryApiClient({
    request: {
      url: isTeamLeaderGoal ? `/api/goal/leader?year=${params.year}` : `/api/goal/member?year=${params.year}`,
      method: 'GET',
    },
  });
  return (
    <div>
      <div className="styled_header">
        <BackButton onClick={() => navigate(-1)} color="black" label={t('back')} />
        <h1 className="title">
          {t('goal_page_title_with_room')
            .replace('{year}', selectedYear)
            .replace('{team}', teamAndRoom?.data?.team ?? '')}
        </h1>
      </div>
      <GoalTable goalAndTeam={teamAndRoom?.data} goal={ceoGoal?.data} roleType="CEO" />
      <br />
      {goal?.data?.id && (goal?.data.status === 'Approved' || goal?.data?.status == 'PendingReview') ? (
        <>
          <GoalTable goalAndTeam={teamAndRoom?.data} goal={goal?.data} roleType="TEAM_LEADER" />
        </>
      ) : (
        <>
          <GoalForm
            type={goal?.data?.id ? 'EDIT' : 'ADD'}
            createGoal={createGoalFromTeam}
            updateGoal={updateGoal}
            goal={goal?.data}
          />
        </>
      )}
      <br />
      <br />
      {goal?.data && <CommentHistory comment={goal?.data} />}
    </div>
  );
}
