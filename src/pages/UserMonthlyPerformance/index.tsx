import { Card, Form } from 'antd';
import { FormInstance } from 'antd/lib';
import { PerformanceCommentHistory } from 'components';
import { StyledGoalTable } from 'components/GoalTable/style';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation,  useParams } from 'react-router-dom';
import { ApiData } from 'types/User';
import { Button, TextArea } from 'ui';

interface Target {
  valueRatio?: number;
  valueRatioStatus?: number;
  valueNumber?: number;
  valueText?: string;
  id?: number;
  targetValueId?: number;
}

interface props {
  goal: ApiData | null;
  roleType: 'CEO' | 'TEAM_LEADER' | 'TEAM_MEMBER';
  goalAndTeam: { team: string; room: string };
  isEditing?: boolean;
  onSubmit?: () => void;
  monthlyValue: any;
  setTarget?: (targets: Target[]) => void;
  form: FormInstance;
}

export function UserMonthlyPerformance({
  goal,
  roleType,
  isEditing = true,
  onSubmit,
  monthlyValue,
  setTarget,
  form,
}: props) {
  const { t } = useTranslation();
  const params = useParams();
  const location = useLocation();
  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    if (monthlyValue?.monthlyTargetValue && Array.isArray(monthlyValue?.monthlyTargetValue)) {
      const mappedTargets = monthlyValue?.monthlyTargetValue?.map((t: any) => ({
        valueRatio: t.valueRatio,
        valueRatioStatus: t.valueRatioStatus,
        valueNumber: t.valueNumber,
        valueText: t.valueText,
        id: t.id,
        targetValueId: t.targetValueId,
      }));
      setTargets(mappedTargets);
    }
  }, [monthlyValue?.monthlyTargetValue]);

  const handleInputChange = (field: keyof Target, value: string | number, id?: number) => {
    setTargets((prev) => {
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

  const handleSubmit = () => {
    onSubmit && onSubmit();
  };

  useEffect(() => {
    setTarget && setTarget(targets);
  }, [targets]);

  return (
    <StyledGoalTable>
      <div className="kpi-table-container">
        <div className="table-wrapper">
          <table className="kpi-table">
            <thead>
              <tr className="column-headers">
                <th className="category-header">{t('division')}</th>
                <th className="content-header">{t('goal_content')}</th>
                {roleType !== 'CEO' && <th className="target-header">{t('target_value')}</th>}
              </tr>
            </thead>
            <tbody>
              {goal?.divisions?.map(
                (division, divisionIndex) =>
                  division?.goals?.map((item, goalIndex) => {
                    const { type, valueText, evaluationText, status, id } = item.targetValue || {};

                    const currentTarget = targets.find((t) => t.targetValueId === id);
                    const isTeamLeader = monthlyValue?.isTeamLeader;
                    const currentStatus = monthlyValue?.status;
                    const isReadOnly =
                      (isTeamLeader && currentStatus !== 'PendingReview') ||
                      (!isTeamLeader && (currentStatus === 'Approved' || currentStatus === 'PendingReview'));

                    const canEditField = (fieldType: string) => {
                      if (isReadOnly) return false;
                      if (fieldType === 'IndividualEvaluation' || fieldType === 'LeaderEvaluation') return false;
                      return true;
                    };

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
                        {roleType !== 'CEO' && (
                          <td className="target-cell">
                            <div className="target-content">
                              {isEditing && canEditField(type) ? (
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
                        )}
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>

        <br />
        {monthlyValue?.monthlyTargetComment?.length > 0 && (
          <PerformanceCommentHistory comment={{ comments: monthlyValue?.monthlyTargetComment }} />
        )}

        {['nowritte', 'returned'].includes(monthlyValue?.status?.toLowerCase?.() ?? '') && (
          <Form form={form} layout="vertical">
            <Card className="comment-card">
              <TextArea name="comment" rows={4} placeholder={t('add_comment_area')} />
            </Card>
          </Form>
        )}

        <br />

        {!location.pathname.includes('team-performance') &&
          ['nowritte', 'returned'].includes(monthlyValue?.status?.toLowerCase?.() ?? '') && (
            <div className="submit-section">
              <Button
                type="primary"
                size="large"
                className="submit-btn"
                label={goal?.id ? t('update_yearly_gaol') : t('create_yearly_gaol')}
                htmlType="submit"
                onClick={handleSubmit}
              />
            </div>
          )}
      </div>
    </StyledGoalTable>
  );
}
