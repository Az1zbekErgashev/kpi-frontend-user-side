import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { StyledGoalPage } from './style';
import { CommentHistory, GoalForm, GoalTable } from 'components';
import { BackButton, Button } from 'ui';
import { useGoal } from 'hooks/useGoal';
import { useUser } from 'hooks/useUserState';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import dayjs from 'dayjs';

export function GoalPage() {
  const token = Cookies.get('jwt');
  //@ts-ignore
  const role = decodeToken(token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useUser();
  const goalHook = useGoal();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentYear = dayjs().year();
  const [formStatus, setFormStatus] = useState(true);
  const year = new Date().getFullYear().toString();
  const selectedYear = params.year ?? year;

  const isTeamLeader = role === 'TeamLeader';
  const isCurrentUser = user?.id?.toString() === params.id;
  const goalId = isTeamLeader ? goalHook.goal?.id : goalHook.teamLeaderGoal?.data?.id;
  const goalStatus = isTeamLeader ? goalHook.goal?.status : goalHook.goalByToken?.data?.status;

  const showUpdateButton = isCurrentUser && goalStatus !== 'Approved';
  const showTeamLeaderTable = formStatus && goalId;

  useEffect(() => {
    if (role === 'TeamMember') {
      goalHook.getTeamLeaderGoal();
      goalHook.getGoalByToken();
    } else {
      goalHook.getGoalByUserId();
    }
  }, []);

  useEffect(() => {
    const paramYear = params.year;
    const parsed = parseInt(paramYear || '', 10);

    const isValidYear = !isNaN(parsed) && /^\d{4}$/.test(paramYear || '') && parsed >= 2000 && parsed <= currentYear;

    if (!isValidYear) {
      navigate('/', { replace: true });
    }
  }, [params.year]);

  return (
    <StyledGoalPage>
      <div className="styled_header">
        <BackButton onClick={() => navigate(-1)} color="black" label={t('back')} />
        <h1 className="title">
          {t('goal_page_title_with_room')
            .replace('{year}', selectedYear)
            .replace('{team}', goalHook.teamAndRoom?.data?.team ?? '')}
        </h1>
      </div>

      <GoalTable
        goalAndTeam={goalHook.teamAndRoom?.data}
        goal={isTeamLeader ? goalHook.ceoGoal?.data : goalHook.teamLeaderGoal?.data}
        roleType="CEO"
      />

      <br />
      <br />

      {showTeamLeaderTable ? (
        <>
          <GoalTable
            goalAndTeam={goalHook.teamAndRoom?.data}
            goal={isTeamLeader ? goalHook.goal : goalHook.goalByToken?.data}
            roleType="TEAM_LEADER"
          />
          <br />
          {showUpdateButton && (
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
          {role === 'TeamMember' ? (
            <GoalForm
              type={goalHook.goalByToken?.data?.id ? 'EDIT' : 'ADD'}
              createGoal={goalHook.createGoalFromTeam}
              updateGoal={goalHook.updateGoal}
              goal={role === 'TeamMember' ? goalHook.goalByToken?.data : goalHook.goal}
              setFormStatus={setFormStatus}
            />
          ) : (
            <GoalForm
              type={goalHook.goal?.id ? 'EDIT' : 'ADD'}
              createGoal={goalHook.createGoalFromTeam}
              updateGoal={goalHook.updateGoal}
              goal={role === 'TeamMember' ? goalHook.goalByToken?.data : goalHook.goal}
              setFormStatus={setFormStatus}
            />
          )}
        </>
      )}

      <br />
      <br />

      {goalHook.goal && <CommentHistory comment={goalHook.goal} />}
    </StyledGoalPage>
  );
}
