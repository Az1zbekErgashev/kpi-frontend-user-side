import React from 'react';
import { StyledMonthlyValue } from './style';
import useQueryApiClient from 'utils/useQueryApiClient';
import { useParams } from 'react-router-dom';
import { GoalTable } from 'components/GoalTable';
import { GoalTableForPerformance } from 'components';
import { Button, TextArea } from 'ui';
import { useTranslation } from 'react-i18next';
import { GoalCommentForCEO } from 'components/GoalCommentForCEO';
import { Card, Form } from 'antd';

export function MonthlyValue() {
  const params = useParams();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { data: monthlyData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget',
      data: { userId: params.id, year: params.year, month: params.month },
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

  const onSubmit = (data: any) => {
    createMonthData(data);
  };

  return (
    <StyledMonthlyValue>
      <GoalTable goal={monthlyData?.data?.goal} roleType="TEAM_LEADER" goalAndTeam={teamAndRoom?.data} />
      <br />
      <GoalTableForPerformance
        onSubmit={onSubmit}
        goal={monthlyData?.data?.goal}
        roleType="TEAM_LEADER"
        goalAndTeam={teamAndRoom?.data}
      />
    </StyledMonthlyValue>
  );
}
