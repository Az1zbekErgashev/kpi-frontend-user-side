import { Card, Form } from 'antd';
import { GoalTable, PerformanceCommentHistory } from 'components';
import { StyledGoalTable } from 'components/GoalTable/style';
import { StyledMonthlyValue } from 'components/MonthlyValue/style';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton, Button, TextArea } from 'ui';
import useQueryApiClient from 'utils/useQueryApiClient';

export function MemberPerformance() {
  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const year = new Date().getFullYear().toString();
  const selectedYear = params.year ?? year;
  const [form] = Form.useForm();

  const { data: teamAndRoom } = useQueryApiClient({
    request: {
      url: '/api/goal/team-by-token',
      method: 'GET',
    },
  });

  const { data: monthlyData, refetch: getMonthlyData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget',
      method: 'GET',
      data: { year: params.year, month: params.month, userId: params.id },
    },
  });

  const { appendData: changeMonthlyStatus } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget/change-status',
      method: 'PUT',
    },
    onSuccess() {
      getMonthlyData();
    },
  });

  const handleFinish = (status: boolean) => {
    changeMonthlyStatus({
      goalId: monthlyData?.data?.id,
      comment: form.getFieldValue('comment'),
      status: status,
    });
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
      <StyledGoalTable>
        <div className="table-wrapper">
          <table className="kpi-table">
            <thead>
              <tr className="column-headers">
                <th className="category-header">{t('division')}</th>
                <th className="content-header">{t('goal_content')}</th>
                <th className="target-header">{t('target_value')}</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData?.data?.goal?.divisions?.map(
                (division: any, divisionIndex: number) =>
                  division?.goals?.map((item: any, goalIndex: number) => {
                    const { type, valueText, evaluationText, status, id } = item.targetValue || {};
                    const currentTarget = monthlyData?.data?.monthlyTargetValue?.find(
                      (t: any) => t.targetValueId === id
                    );
                    return (
                      <tr
                        key={`${division.id}-${goalIndex}`}
                        className={divisionIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                      >
                        {goalIndex === 0 && (
                          <td className="category-cell" rowSpan={division.goals.length}>
                            {division.name}
                          </td>
                        )}
                        <td className="content-cell">
                          <div className="goal-content">
                            <span className="checkmark">✓</span>
                            <span className="goal-text">{item.goalContent}</span>
                          </div>
                        </td>
                        <td className="target-cell">
                          <div className="target-content">
                            <div className="target-text">
                              {type === 'RatioType' && (
                                <>
                                  {valueText || currentTarget?.valueText || ''}: {currentTarget?.valueRatio ?? 0}/
                                  {currentTarget?.valueRatioStatus ?? 0}
                                  {status && ` ${t(status)}`}
                                </>
                              )}

                              {type === 'NumberOfTimesType' && (
                                <>
                                  {valueText || currentTarget?.valueText || ''}: {currentTarget?.valueNumber ?? 0}
                                  {status && ` ${t(status)}`}
                                </>
                              )}

                              {type === 'TextType' && <>{currentTarget?.valueText || t('text_type')}</>}

                              {(type === 'IndividualEvaluation' || type === 'LeaderEvaluation') && (
                                <>
                                  {type === 'IndividualEvaluation'
                                    ? t('[individual_evaluation]')
                                    : t('[leader_evaluation]')}
                                  {evaluationText ? ` ${evaluationText}` : ''}
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </StyledGoalTable>
      <br />
      {monthlyData?.data?.monthlyTargetComment?.length > 0 && (
        <PerformanceCommentHistory comment={{ comments: monthlyData?.data?.monthlyTargetComment }} />
      )}

      {['pendingreview'].includes(monthlyData?.data?.status?.toLowerCase?.() ?? '') && (
        <Form form={form} layout="vertical">
          <Card className="comment-card">
            <TextArea name="comment" rows={4} placeholder={t('add_comment_area')} />
          </Card>
        </Form>
      )}
      {['pendingreview'].includes(monthlyData?.data?.status?.toLowerCase?.() ?? '') && (
        <>
          <br />
          <div className="flex-button">
            <Button onClick={() => handleFinish(true)} label={t('approve')} type="primary" />
            <Button onClick={() => handleFinish(false)} label={t('reject_for_correct')} type="primary" danger />
          </div>
        </>
      )}
    </StyledMonthlyValue>
  );
}
