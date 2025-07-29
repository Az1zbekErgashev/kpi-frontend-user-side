import { Form } from 'antd';
import { EvaluationForm, GoalTable, GradeDisplay } from 'components';
import { StyledGoalTable } from 'components/GoalTable/style';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from 'ui';
import useQueryApiClient from 'utils/useQueryApiClient';

interface Target {
  valueRatio?: number;
  valueRatioStatus?: number;
  valueNumber?: number;
  valueText?: string;
  id?: number;
  targetValueId?: number;
}

export function TeamPerformance() {
  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const year = new Date().getFullYear().toString();
  const selectedYear = params.year ?? year;
  const [form] = Form.useForm();
  const [targets, setTargets] = useState<Target[]>([]);

  const { data: monthlyData, refetch: getMonthlyData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget/leader',
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
  });

  const { appendData: updateMonthData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget',
      method: 'PUT',
    },
  });

  useEffect(() => {
    if (monthlyData?.data?.monthlyTargetValue && Array.isArray(monthlyData?.data?.monthlyTargetValue)) {
      const mappedTargets = monthlyData?.data?.monthlyTargetValue?.map((t: any) => ({
        valueRatio: t.valueRatio,
        valueRatioStatus: t.valueRatioStatus,
        valueNumber: t.valueNumber,
        valueText: t.valueText,
        id: t.id,
        targetValueId: t.targetValueId,
      }));
      setTargets(mappedTargets);
    }
  }, [monthlyData?.data?.monthlyTargetValue]);

  const handleInputChange = (field: keyof Target, value: string | number, id?: number) => {
    setTargets((prev: any) => {
      const newTargets = [...prev];
      const targetIndex = newTargets.findIndex((t) => t.targetValueId === id);
      if (targetIndex >= 0) {
        newTargets[targetIndex] = { ...newTargets[targetIndex], [field]: value };
      } else {
        newTargets.push({ [field]: value, targetValueId: id });
      }
      return newTargets;
    });
  };

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
    <div>
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
                <th className="ratio-header">{t('ratio')}</th>
                <th className="content-header">{t('goal_content')}</th>
                <th className="target-header">{t('target_value')}</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData?.data?.goal?.divisions?.map(
                (division: any, divisionIndex: number) =>
                  division?.goals?.map((item: any, goalIndex: number) => {
                    const { type, valueText, evaluationText, status, id } = item.targetValue || {};

                    const currentTarget = targets.find((t: any) => t.targetValueId === id);

                    const canEditField = (fieldType: string) => {
                      if (fieldType === 'IndividualEvaluation' || fieldType === 'LeaderEvaluation') return false;
                      return true;
                    };

                    const isEditable =
                      monthlyData?.data?.status !== 'Approved' && monthlyData?.data?.status !== 'PendingReview';

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
                        <td className="ratio-cell" rowSpan={division.goals.length}>
                          {division.ratio}
                        </td>
                        <td className="content-cell">
                          <div className="goal-content">
                            <span className="checkmark">✓</span>
                            <span className="goal-text">{item.goalContent}</span>
                          </div>
                        </td>
                        <td className="target-cell">
                          <div className="target-content">
                            {canEditField(type) && isEditable ? (
                              <>
                                {type === 'TextType' ? (
                                  <div className="flex items-center">
                                    {valueText && <span className="mr-2">{valueText} :</span>}
                                    <textarea
                                      value={currentTarget?.valueText || ''}
                                      onChange={(e) => handleInputChange('valueText', e.target.value, id)}
                                      rows={4}
                                      className="w-full p-2 border rounded"
                                    />
                                    <input type="hidden" value={currentTarget?.id || ''} name={`hidden_id_${id}`} />
                                  </div>
                                ) : type === 'RatioType' ? (
                                  <div className="flex items-center">
                                    <div>{valueText}</div>
                                    <input
                                      type="number"
                                      value={currentTarget?.valueRatio || ''}
                                      onChange={(e) =>
                                        handleInputChange('valueRatio', parseFloat(e.target.value) || 0, id)
                                      }
                                      className="w-20 p-2 border rounded"
                                    />
                                    <span>/</span>
                                    <input
                                      type="number"
                                      value={currentTarget?.valueRatioStatus || ''}
                                      onChange={(e) =>
                                        handleInputChange('valueRatioStatus', parseFloat(e.target.value) || 0, id)
                                      }
                                      className="w-20 p-2 border rounded"
                                    />
                                    <input type="hidden" value={currentTarget?.id || ''} name={`hidden_id_${id}`} />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div>{valueText}</div>
                                    <input
                                      type="number"
                                      value={currentTarget?.valueNumber || ''}
                                      onChange={(e) =>
                                        handleInputChange('valueNumber', parseFloat(e.target.value) || 0, id)
                                      }
                                      className="w-20 p-2 border rounded"
                                    />
                                    <span>{status ? t(status) : ''}</span>
                                    <input type="hidden" value={currentTarget?.id || ''} name={`hidden_id_${id}`} />
                                  </div>
                                )}
                              </>
                            ) : (
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
                            )}
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
      <br />
      <EvaluationForm
        getMonthlyData={getMonthlyData}
        monthlyValue={monthlyData?.data}
        onSubmit={onSubmit}
        form={form}
      />
      <GradeDisplay />
    </div>
  );
}
