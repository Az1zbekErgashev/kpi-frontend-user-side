import React from 'react';
import { StyledMonthlyValue } from './style';
import useQueryApiClient from 'utils/useQueryApiClient';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GoalTable } from 'components/GoalTable';
import { EvaluationForm, GoalTableForPerformance } from 'components';
import { useTranslation } from 'react-i18next';
import { BackButton } from 'ui';

export function MonthlyValue() {
  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: monthlyData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget',
      data: { userId: params.id, year: params.year, month: params.month },
    },
    onError(error) {
      if (error.error == 'user_not_found') {
        navigate(-1);
      }
    },
  });

  const { data: teamAndRoom } = useQueryApiClient({
    request: {
      url: '/api/goal/team-by-token',
      method: 'GET',
    },
  });

  const { appendData: createMonthData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget',
      method: 'POST',
    },
  });

  const { appendData: updateMonthData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget',
      method: 'PUT',
    },
  });

  const onSubmit = (data: any) => {
    if (monthlyData?.data?.monthlyTargetValue && monthlyData?.data?.monthlyTargetValue.length > 0) {
      updateMonthData(data);
    } else {
      createMonthData(data);
    }
  };

  return (
    <StyledMonthlyValue>
      <div>
        <BackButton color="black" onClick={() => navigate(-1)} label={t('back')} />
      </div>
      <GoalTable goal={monthlyData?.data?.goal} roleType="TEAM_LEADER" goalAndTeam={teamAndRoom?.data} />
      <br />
      <GoalTableForPerformance
        onSubmit={onSubmit}
        goal={monthlyData?.data?.goal}
        roleType="TEAM_LEADER"
        goalAndTeam={teamAndRoom?.data}
        monthlyValue={monthlyData?.data}
      />
      {location.pathname.includes('/goal/team-performance') && <EvaluationForm />}
    </StyledMonthlyValue>
  );
}
