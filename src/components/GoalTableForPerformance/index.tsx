import React, { useState, useEffect } from 'react';
import { StyledGoalTable } from '../GoalTable/style';
import { useTranslation } from 'react-i18next';
import { ApiData } from 'types/User';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, TextArea } from 'ui';
import { Card, Form } from 'antd';
import { PerformanceCommentHistory } from 'components';
import useQueryApiClient from 'utils/useQueryApiClient';

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
  onSubmit?: (value: any) => void;
  monthlyValue: any;
}

export function GoalTableForPerformance({
  goal,
  roleType,
  goalAndTeam,
  isEditing = true,
  onSubmit,
  monthlyValue,
}: props) {
  const { t } = useTranslation();
  const params = useParams();
  const year = params.year;
  const newDateTime = new Date().getFullYear().toString();
  const location = useLocation();
  const [targets, setTargets] = useState<Target[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

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

  const handleInputChange = (
    divisionIndex: number,
    goalIndex: number,
    field: keyof Target,
    value: string | number,
    id?: number
  ) => {
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
    if (onSubmit) {
      const data = {
        comment: form.getFieldValue('comment'),
        targets,
        goalId: goal?.id,
        month: params.month,
        year: params.year,
      };
      onSubmit(data);
    }
  };

  const { appendData: changeStatusMonthData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget/change-status',
      method: 'PUT',
    },
    onSuccess() {
      form.resetFields();
      setTargets([]);
      navigate(-1);
    },
  });

  const handleChangeStatus = (status: boolean) => {
    const data = {
      comment: form.getFieldValue('comment'),
      goalId: monthlyValue?.id,
      status,
    };
    changeStatusMonthData(data);
  };

  return (
    <StyledGoalTable>
      <div className="kpi-table-container">
        <div className="table-wrapper">
          <table className="kpi-table">
            <thead>
              {!location.pathname.includes('yearly-goal') && (
                <tr className="header-row">
                  <th
                    colSpan={4}
                    className="main-header"
                    dangerouslySetInnerHTML={{
                      __html: t(roleType === 'CEO' ? 'goal_table_header_ceo_title' : 'goal_table_header_team_title')
                        .replace('{year}', year?.toString() ?? newDateTime)
                        .replace('{room}', goalAndTeam?.room || '')
                        .replace('{team}', goalAndTeam?.team || ''),
                    }}
                  ></th>
                </tr>
              )}
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
                    const { type, valueRatio, valueRatioStatus, valueNumber, valueText, evaluationText, status, id } =
                      item.targetValue || {};

                    const currentTarget = targets.find((t) => t.targetValueId === id);

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
                              {isEditing && type !== 'IndividualEvaluation' && type !== 'LeaderEvaluation' ? (
                                <>
                                  {type === 'TextType' ? (
                                    <div className="flex items-center">
                                      {valueText && <span className="mr-2">{valueText} :</span>}
                                      {monthlyValue?.isTeamLeader ? (
                                        <div>{currentTarget?.valueText}</div>
                                      ) : (monthlyValue?.status === 'Returned' && monthlyValue?.isSended) ||
                                        (location.pathname.includes('team-performance') &&
                                          monthlyValue?.status === 'Returned' &&
                                          !monthlyValue?.isSended) ||
                                        (monthlyValue?.status === 'PendingReview' && !monthlyValue?.isSended) ? (
                                        <textarea
                                          value={currentTarget?.valueText || ''}
                                          onChange={(e) =>
                                            handleInputChange(divisionIndex, goalIndex, 'valueText', e.target.value, id)
                                          }
                                          rows={4}
                                          style={{
                                            width: '100%',
                                            border: '1px solid black',
                                            padding: '8px',
                                            borderRadius: '4px',
                                          }}
                                          className="w-full p-2 border rounded"
                                        />
                                      ) : (
                                        <div>{currentTarget?.valueText}</div>
                                      )}
                                      <input type="hidden" value={currentTarget?.id || ''} name={`hidden_id_${id}`} />
                                    </div>
                                  ) : type === 'RatioType' ? (
                                    <div
                                      className="flex items-center"
                                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                      {monthlyValue?.isTeamLeader ? (
                                        <div>{currentTarget?.valueRatio}</div>
                                      ) : monthlyValue?.isSended ||
                                        monthlyValue?.status === 'Returned' ||
                                        (location.pathname.includes('team-performance') &&
                                          monthlyValue?.status === 'Returned' &&
                                          !monthlyValue?.isSended) ||
                                        (monthlyValue?.status === 'PendingReview' && !monthlyValue?.isSended) ? (
                                        <input
                                          type="number"
                                          style={{ width: '50px' }}
                                          value={currentTarget?.valueRatio || ''}
                                          onChange={(e) =>
                                            handleInputChange(
                                              divisionIndex,
                                              goalIndex,
                                              'valueRatio',
                                              parseFloat(e.target.value) || 0,
                                              id
                                            )
                                          }
                                          className="w-20 p-2 border rounded mr-1"
                                        />
                                      ) : (
                                        <div>{currentTarget?.valueRatio}</div>
                                      )}
                                      <span>/</span>
                                      {monthlyValue?.isTeamLeader ? (
                                        <div>{currentTarget?.valueRatio}</div>
                                      ) : monthlyValue?.isSended ||
                                        monthlyValue?.status === 'Returned' ||
                                        (location.pathname.includes('team-performance') &&
                                          monthlyValue?.status === 'Returned' &&
                                          !monthlyValue?.isSended) ||
                                        (monthlyValue?.status === 'PendingReview' && !monthlyValue?.isSended) ? (
                                        <input
                                          type="number"
                                          style={{ width: '50px' }}
                                          value={currentTarget?.valueRatioStatus || ''}
                                          onChange={(e) =>
                                            handleInputChange(
                                              divisionIndex,
                                              goalIndex,
                                              'valueRatioStatus',
                                              parseFloat(e.target.value) || 0,
                                              id
                                            )
                                          }
                                          className="w-20 p-2 border rounded ml-1"
                                        />
                                      ) : (
                                        <div>{currentTarget?.valueRatioStatus}</div>
                                      )}

                                      <input type="hidden" value={currentTarget?.id || ''} name={`hidden_id_${id}`} />
                                    </div>
                                  ) : (
                                    <div
                                      className="flex items-center"
                                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                      {monthlyValue?.isTeamLeader ? (
                                        <div>{currentTarget?.valueRatio}</div>
                                      ) : monthlyValue?.isSended ||
                                        monthlyValue?.status === 'Returned' ||
                                        (location.pathname.includes('team-performance') &&
                                          monthlyValue?.status === 'Returned' &&
                                          !monthlyValue?.isSended) ||
                                        (monthlyValue?.status === 'PendingReview' && !monthlyValue?.isSended) ? (
                                        <input
                                          style={{ width: '50px' }}
                                          type="number"
                                          value={currentTarget?.valueNumber || ''}
                                          onChange={(e) =>
                                            handleInputChange(
                                              divisionIndex,
                                              goalIndex,
                                              'valueNumber',
                                              parseFloat(e.target.value) || 0,
                                              id
                                            )
                                          }
                                          className="w-20 p-2 border rounded mr-1"
                                        />
                                      ) : (
                                        <div>{currentTarget?.valueNumber}</div>
                                      )}
                                      <span className="ml-2">{status ? t(status) : ''}</span>
                                      <input type="hidden" value={currentTarget?.id || ''} name={`hidden_id_${id}`} />
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="target-text">
                                  {type === 'RatioType' &&
                                    `${valueText || ''}: ${valueRatio ?? 0}/${valueRatioStatus ?? 0} ${
                                      status ? t(status) : ''
                                    }`}
                                  {type === 'NumberOfTimesType' && valueText
                                    ? `${valueText} : ${valueNumber ?? 0} ${t(status)}`
                                    : type === 'IndividualEvaluation' || type === 'LeaderEvaluation'
                                      ? (type === 'IndividualEvaluation'
                                          ? t('[individual_evaluation]')
                                          : t('[leader_evaluation]')) + (evaluationText ? ` ${evaluationText}` : '')
                                      : type === 'TextType'
                                        ? t('text_type')
                                        : null}
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
        {monthlyValue?.monthlyTargetComment && (
          <PerformanceCommentHistory comment={{ comments: monthlyValue?.monthlyTargetComment }} />
        )}
        {monthlyValue?.goal && (
          <>
            {((monthlyValue?.isTeamLeader && monthlyValue?.status === 'PendingReview') ||
              !['Approved', 'PendingReview'].includes(monthlyValue?.status) ||
              !monthlyValue.isSended) && (
              <Form form={form} layout="vertical">
                <Card className="comment-card">
                  <TextArea name="comment" rows={4} placeholder={t('add_comment_area')} />
                </Card>
              </Form>
            )}
          </>
        )}

        <br />
        {monthlyValue?.goal && (
          <>
            {monthlyValue?.isTeamLeader ? (
              <>
                {monthlyValue.status == 'PendingReview' && (
                  <div className="flex-button">
                    <Button onClick={() => handleChangeStatus(true)} label={t('approve')} type="primary" />
                    <Button
                      onClick={() => handleChangeStatus(false)}
                      label={t('reject_for_correct')}
                      type="primary"
                      danger
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {((monthlyValue.status !== 'PendingReview' && monthlyValue?.status !== 'Approved') ||
                  !monthlyValue?.isSended) && (
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
              </>
            )}
          </>
        )}
      </div>
    </StyledGoalTable>
  );
}
