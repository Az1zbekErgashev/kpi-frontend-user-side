import { CommentHistory, GoalTable } from 'components';
import { GoalCommentForCEO } from 'components/GoalCommentForCEO';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from 'ui';
import useQueryApiClient from 'utils/useQueryApiClient';

export function UserGoal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const currentYear = dayjs().year();
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

  const { data: ceoGoal } = useQueryApiClient({
    request: {
      url: `/api/goal/ceo-goal/${params.year}`,
      method: 'GET',
    },
    onError: () => {
      alert(t('error_fetching_ceo_goal'));
      navigate('/', { replace: true });
    },
  });

  const { data: teamAndRoom } = useQueryApiClient({
    request: {
      url: '/api/goal/team-by-token',
      method: 'GET',
    },
  });

  const { data: goal } = useQueryApiClient({
    request: {
      url: `/api/goal/member/${params.id}/${params.year}`,
      method: 'GET',
    },
    onError(error) {
      if (error.error == 'teamId_or_userId_notcorrect') {
        alert(t('team_or_user_not_correct'));
        navigate('/', { replace: true });
      }
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
      <GoalTable goalAndTeam={teamAndRoom?.data} goal={goal?.data} roleType="TEAM_LEADER" />
      <br />
      <br />
      {goal?.data && <CommentHistory comment={goal?.data} />}
      {goal?.data?.status == 'PendingReview' && <GoalCommentForCEO goal={goal?.data} status={true} />}
    </div>
  );
}
