import React, { useEffect, useState } from 'react';
import { StyledGoalPage } from './style';
import { CommentHistory, GoalForm, GoalTable } from 'components';
import { useGoal } from 'hooks/useGoal';
import { useTranslation } from 'react-i18next';
import { BackButton, Button } from 'ui';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from 'hooks/useUserState';

export function GoalPage() {
  const goalHook = useGoal();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const year = new Date().getFullYear().toString();
  const selectedYear = params.year;
  const { user } = useUser();

  const [formStatus, setFormStatus] = useState<boolean>(false);

  useEffect(() => {
    if (goalHook?.goal) {
      setFormStatus(true);
    } else setFormStatus(true);
  }, [goalHook?.goal]);

  console.log(user?.id);

  return (
    <StyledGoalPage>
      <div className="styled_header">
        <BackButton onClick={() => navigate(-1)} color="black" label={t('back')} />
        <h1 className="title">
          {t('goal_page_title_with_room')
            .replace('{year}', selectedYear?.toString() ?? year)
            .replace('{team}', goalHook.teamAndRoom?.data?.team ?? '')}
        </h1>
      </div>
      <GoalTable goalAndTeam={goalHook.teamAndRoom?.data} goal={goalHook.ceoGoal?.data} roleType="CEO" />
      <br />
      <br />
      {formStatus ? (
        <>
          <GoalTable goalAndTeam={goalHook.teamAndRoom?.data} goal={goalHook.goal} roleType="TEAM_LEADER" />
          <br />
          {user?.id?.toString() == params.id && (
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
            type={goalHook.goal?.id ? 'EDIT' : 'ADD'}
            createGoal={goalHook.createGoalFromTeam}
            updateGoal={goalHook.updateGoal}
            goal={goalHook.goal}
            setFormStatus={setFormStatus}
          />
        </>
      )}
      <br />
      <br />
      {goalHook.goal && <CommentHistory comment={goalHook.goal} />}
    </StyledGoalPage>
  );
}
