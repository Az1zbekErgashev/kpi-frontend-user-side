import React, { useState } from 'react';
import { StyledMonthlyValue } from './style';
import useQueryApiClient from 'utils/useQueryApiClient';
import { useNavigate, useParams } from 'react-router-dom';
import { GoalTable } from 'components/GoalTable';
import { useTranslation } from 'react-i18next';
import { BackButton } from 'ui';
import { UserMonthlyPerformance } from 'pages/UserMonthlyPerformance';
import { Form } from 'antd';

export function MonthlyValue() {
  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [targets, setTargets] = useState<any>([]);
  const year = new Date().getFullYear().toString();
  const selectedYear = params.year ?? year;
  const [form] = Form.useForm();

  const { data: monthlyData, refetch: getMonthlyData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget/member',
      data: { year: params.year, month: params.month },
    },
    onError(error) {
      if (error.error == 'user_not_found') {
        navigate(-1);
      } else if (error.error == 'teamId_or_userId_notcorrect') {
        alert(t('team_or_user_not_correct'));
        navigate('/', { replace: true });
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
    onSuccess() {
      getMonthlyData();
    },
  });

  const { appendData: updateMonthData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget',
      method: 'PUT',
    },
    onSuccess() {
      getMonthlyData();
    },
  });

  const onSubmit = () => {
    const data = {
      comment: form.getFieldValue('comment'),
      targets,
      goalId: monthlyData?.data?.goal?.id,
      month: params.month,
      year: params.year,
    };
    if (monthlyData?.data?.monthlyTargetValue?.length > 0) {
      updateMonthData(data);
    } else {
      createMonthData(data);
    }
  };

  return (
    <StyledMonthlyValue>
      <div className="styled_header">
        <BackButton onClick={() => navigate(-1)} color="black" label={t('back')} />
        <h1 className="title">
          {t('performance_page_title_with_room')
            .replace('{year}', selectedYear)
            .replace('{team}', teamAndRoom?.data?.team ?? '')}
        </h1>
      </div>
      <GoalTable goal={monthlyData?.data?.goal} roleType="TEAM_LEADER" goalAndTeam={teamAndRoom?.data} />
      <br />
      <UserMonthlyPerformance
        onSubmit={onSubmit}
        goal={monthlyData?.data?.goal}
        roleType="TEAM_LEADER"
        goalAndTeam={teamAndRoom?.data}
        monthlyValue={monthlyData?.data}
        setTarget={setTargets}
        form={form}
      />
    </StyledMonthlyValue>
  );
}
