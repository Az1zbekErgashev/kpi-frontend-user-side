import { CommentHistory, GoalForm, GoalTable } from 'components';
import dayjs from 'dayjs';
import { StyledGoalPage } from 'pages/Goal/style';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton, Button } from 'ui';
import useQueryApiClient from 'utils/useQueryApiClient';

export function GoalByUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const currentYear = dayjs().year();
  const [formStatus, setFormStatus] = useState(true);
  const year = new Date().getFullYear().toString();
  const selectedYear = params.year ?? year;

  useEffect(() => {
    const paramYear = params.year;
    const parsed = parseInt(paramYear || '', 10);

    const isValidYear = !isNaN(parsed) && /^\d{4}$/.test(paramYear || '') && parsed >= 2000 && parsed <= currentYear;

    if (!isValidYear) {
      navigate('/', { replace: true });
    }
  }, [params.year]);

  const { data: teamLeaderGoal } = useQueryApiClient({
    request: {
      url: `/api/goal/team-leader/${params.year}`,
    },
  });

  const { data: goalByToken, refetch: getTeamMemberGoal } = useQueryApiClient({
    request: {
      url: `/api/goal/by-user-token?year=${params.year}`,
    },
  });

  const { data: teamAndRoom } = useQueryApiClient({
    request: {
      url: '/api/goal/team-by-token',
      method: 'GET',
    },
  });

  const { appendData: createGoalFromTeam } = useQueryApiClient({
    request: {
      url: '/api/goal/create-from-team',
      method: 'POST',
    },
    onSuccess: () => {
      getTeamMemberGoal();
      setFormStatus(true);
    },
  });

  const { appendData: updateGoal } = useQueryApiClient({
    request: {
      url: '/api/goal/update',
      method: 'PUT',
    },
    onSuccess: () => {
      getTeamMemberGoal();
      setFormStatus(true);
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
      <GoalTable goalAndTeam={teamAndRoom?.data} goal={teamLeaderGoal?.data} roleType="CEO" />
      <br />
      <br />
      {goalByToken?.data?.id && formStatus ? (
        <>
          <GoalTable goalAndTeam={teamAndRoom?.data} goal={goalByToken?.data} roleType="TEAM_LEADER" />
          <br />
          {goalByToken?.data?.status !== 'Approved' && (
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
      ) : (
        <>
          <GoalForm
            type={goalByToken?.data?.id ? 'EDIT' : 'ADD'}
            createGoal={createGoalFromTeam}
            updateGoal={updateGoal}
            goal={goalByToken?.data}
            setFormStatus={setFormStatus}
          />
        </>
      )}
      {goalByToken?.data && <CommentHistory comment={goalByToken?.data} />}
    </StyledGoalPage>
  );
}
