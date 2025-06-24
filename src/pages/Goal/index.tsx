import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StyledGoalPage } from './style';
import { CommentHistory, GoalForm, GoalTable } from 'components';
import { BackButton, Button } from 'ui';
import { useGoal } from 'hooks/useGoal';
import { useUser } from 'hooks/useUserState';
import dayjs from 'dayjs';
import useQueryApiClient from 'utils/useQueryApiClient';
import { GoalCommentForCEO } from 'components/GoalCommentForCEO';

export function GoalPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useUser();
  const currentYear = dayjs().year();
  const [formStatus, setFormStatus] = useState(true);
  const year = new Date().getFullYear().toString();
  const selectedYear = params.year ?? year;
  const isCurrentUser = user?.id?.toString() === params.id;

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
      setFormStatus(true);
    },
  });

  const { appendData: updateGoal } = useQueryApiClient({
    request: {
      url: '/api/goal/update',
      method: 'PUT',
    },
    onSuccess: () => {
      getGoalByUserId();
      setFormStatus(true);
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
      url: `/api/goal/ceo-goal/${params.year}`,
      method: 'GET',
    },
  });

  const { refetch: getGoalByUserId, data: goal } = useQueryApiClient({
    request: {
      url: `/api/goal/by-user/${params.id}/${params.year}`,
      method: 'GET',
    },
    onError: (error) => {
      if (error.error === 'user_not_found') {
        navigate('/', { replace: true });
      }
    },
  });

  return (
    <StyledGoalPage>
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

      {goal?.data?.id && formStatus ? (
        <>
          <GoalTable goalAndTeam={teamAndRoom?.data} goal={goal?.data} roleType="TEAM_LEADER" />
          <br />
          {isCurrentUser && goal?.data?.status !== 'Approved' && (
            <div className="submit-section">
              <Button
                onClick={() => setFormStatus(false)}
                type="primary"
                size="large"
                className="submit-btn"
                label={t('update_yearly_gaol')}
              />
            </div>
          )}
        </>
      ) : isCurrentUser ? (
        <>
          <GoalForm
            type={goal?.data?.id ? 'EDIT' : 'ADD'}
            createGoal={createGoalFromTeam}
            updateGoal={updateGoal}
            goal={goal?.data}
            setFormStatus={setFormStatus}
          />
        </>
      ) : null}
      {goal?.data && <CommentHistory comment={goal?.data} />}
      {!isCurrentUser && goal?.data?.status == 'PendingReview' && <GoalCommentForCEO goal={goal?.data} status={true} />}
    </StyledGoalPage>
  );
}
