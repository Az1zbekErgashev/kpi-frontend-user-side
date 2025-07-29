'use client';

import { useMemo, useState } from 'react';
import { StyledEvaluationForm } from './style';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';
import { EvaluationModalConfig, PerformanceCommentHistory } from 'components';
import { Card, Form, FormInstance } from 'antd';
import { TextArea } from 'ui';
import { useTranslation } from 'react-i18next';

interface DivisionEvaluation {
  kpiDivisionId: number;
  divisionName: string;
  ratio: any;
  grade?: string;
  scoreId?: number;
  comment?: string;
  id?: number;
}

interface Employee {
  employeeId: number;
  fullName: string;
  role: string;
  position?: string;
  divisionEvaluations: DivisionEvaluation[];
}

interface EvaluationInput {
  employeeId: number;
  fullName: string;
  role: string;
  position?: string;
  evaluations: {
    [kpiDivisionId: number]: {
      grade?: string;
      score?: number;
      comment?: string;
      scoreId?: number;
      id?: number;
    };
  };
}

interface SubmitData {
  id: number;
  userId: number;
  kpiDivisionId: number;
  year?: number | string;
  month?: number | string;
  grade?: string;
  scoreId?: number;
  comment: string;
}

interface props {
  monthlyValue: any;
  onSubmit: any;
  form: FormInstance;
  getMonthlyData: () => void;
}
export function EvaluationForm({ monthlyValue, onSubmit, form, getMonthlyData }: props) {
  const params = useParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationInput[]>([]);
  const [divisions, setDivisions] = useState<DivisionEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    userId?: number;
    month?: string;
    year?: string;
    open: boolean;
    userName?: string;
    position?: string;
    role?: string;
  }>({ open: false });
  const { t } = useTranslation();

  const { refetch: getEvaluation } = useQueryApiClient({
    request: {
      url: '/api/evaluation',
      data: { year: params?.year, month: params?.month },
    },
    onSuccess(response) {
      setEmployees(response?.data);

      const uniqueDivisions: DivisionEvaluation[] = [];
      const divisionMap = new Map();

      response?.data?.forEach((employee: any) => {
        employee.divisionEvaluations.forEach((div: any) => {
          if (!divisionMap.has(div.kpiDivisionId)) {
            divisionMap.set(div.kpiDivisionId, {
              kpiDivisionId: div.kpiDivisionId,
              divisionName: div.divisionName,
            });
            uniqueDivisions.push({
              kpiDivisionId: div.kpiDivisionId,
              divisionName: div.divisionName,
              ratio: div.ratio,
              scoreId: div.scoreId,
            });
          }
        });
      });

      setDivisions(uniqueDivisions);

      const initialEvaluations: EvaluationInput[] = response?.data?.map((employee: any) => ({
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        role: employee.role,
        position: employee.position,
        evaluations: employee.divisionEvaluations.reduce(
          (acc: any, div: any) => ({
            ...acc,
            [div.kpiDivisionId]: {
              id: div.id || 0,
              grade: div.grade,
              comment: div.comment || '',
              scoreId: div.scoreId,
            },
          }),
          {}
        ),
      }));

      setEvaluations(initialEvaluations);
    },
  });

  const handleChange = (
    employeeIndex: number,
    kpiDivisionId: number,
    field: 'grade' | 'scoreId' | 'comment',
    value: string | number
  ) => {
    const newEvaluations = [...evaluations];
    if (!newEvaluations[employeeIndex].evaluations[kpiDivisionId]) {
      newEvaluations[employeeIndex].evaluations[kpiDivisionId] = {};
    }
    newEvaluations[employeeIndex].evaluations[kpiDivisionId][field] = value as any;

    setEvaluations(newEvaluations);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const submitData: SubmitData[] = [];

      evaluations.forEach((employee) => {
        Object.entries(employee.evaluations).forEach(([kpiDivisionId, evaluation]) => {
          const divisionId = Number(kpiDivisionId);
          const selectedScore = evaluation.scoreId;
          const scoreId = scoreIdMap?.[divisionId]?.[selectedScore ?? 0];

          submitData.push({
            id: evaluation.id || 0,
            userId: employee.employeeId,
            kpiDivisionId: divisionId,
            year: params?.year,
            month: params?.month,
            scoreId: scoreId,
            comment: evaluation.comment || '',
          });
        });
      });

      appendData(submitData);
      onSubmit && onSubmit();
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { appendData } = useQueryApiClient({
    request: {
      url: '/api/evaluation',
      method: 'POST',
    },
    onSuccess() {
      getEvaluation();
      getMonthlyData();
    },
    onError(error) {
      alert('Error submitting evaluation');
    },
  });

  const { data: scoresData } = useQueryApiClient({
    request: {
      url: `/api/evaluation/all-score?year=${params.year}`,
    },
  });

  const scoresMap = useMemo(() => {
    const map: { [divisionId: number]: { grade: string; score: number; scoreId: number }[] } = {};
    scoresData?.data?.forEach((item: any) => {
      if (!map[item.divisionId]) {
        map[item.divisionId] = [];
      }
      map[item.divisionId].push(item);
    });
    return map;
  }, [scoresData]);

  const scoreIdMap = useMemo(() => {
    const map: { [divisionId: number]: { [scoreId: number]: number } } = {};
    scoresData?.data?.forEach((item: any) => {
      if (!map[item.divisionId]) {
        map[item.divisionId] = {};
      }
      map[item.divisionId][item.scoreId] = item.scoreId;
    });
    return map;
  }, [scoresData]);

  if (employees.length === 0) {
    return (
      <StyledEvaluationForm>
        <div className="evaluation-container">
          <div className="loading">Loading employees...</div>
        </div>
      </StyledEvaluationForm>
    );
  }

  const handleOpenModal = (employee: EvaluationInput) => {
    setModalConfig({
      userId: employee.employeeId,
      month: params.month,
      year: params.year,
      open: true,
      userName: employee.fullName,
      position: employee.position,
      role: employee.role,
    });
  };

  return (
    <StyledEvaluationForm>
      <div className="evaluation-container">
        <main className="evaluation-grid">
          {divisions.map((division) => (
            <section key={division.kpiDivisionId} className="evaluation-card">
              <header className="card-header">
                <div className="category-info">
                  <h2 className="category-name">{division.divisionName}</h2>
                  <span className="category-id">{division.ratio}%</span>
                </div>
              </header>

              <div className="card-content">
                <table className="assessment-table">
                  <thead className="table-header">
                    <tr>
                      <th className="th-index">№</th>
                      <th className="th-employee">Employee</th>
                      <th className="th-grade">Grade</th>
                      <th className="th-comments">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {evaluations
                      .filter(
                        (employee) =>
                          employees
                            .find((emp) => emp.employeeId === employee.employeeId)
                            ?.divisionEvaluations.some((div) => div.kpiDivisionId === division.kpiDivisionId)
                      )
                      .map((employee, i) => {
                        const employeeIndex = evaluations.findIndex((emp) => emp.employeeId === employee.employeeId);
                        const currentEvaluation = employee.evaluations[division.kpiDivisionId] || {};

                        return (
                          <tr key={employee.employeeId} className="employee-row">
                            <td className="cell-index">
                              <span className="index-number">{i + 1}</span>
                              <input
                                type="hidden"
                                name={`evaluation_${employee.employeeId}_${division.kpiDivisionId}_id`}
                                value={currentEvaluation.id || 0}
                                disabled={
                                  monthlyValue?.status !== 'Approved' && monthlyValue?.status !== 'PendingReview'
                                }
                              />
                            </td>
                            <td className="cell-employee">
                              <div className="employee-details">
                                <div className="employee-name" onClick={() => handleOpenModal(employee)}>
                                  {employee.fullName}
                                </div>
                                {t(employee.role)} <br />
                              </div>
                            </td>
                            <td className="cell-grade">
                              <select
                                className="grade-selector"
                                value={currentEvaluation.scoreId ?? ''}
                                onChange={(e) =>
                                  handleChange(employeeIndex, division.kpiDivisionId, 'scoreId', Number(e.target.value))
                                }
                                disabled={
                                  monthlyValue?.status === 'Approved' || monthlyValue?.status === 'PendingReview'
                                }
                              >
                                <option value="">-</option>
                                {(scoresMap[division.kpiDivisionId] || []).map((scoreItem) => (
                                  <option key={scoreItem.scoreId} value={scoreItem.scoreId}>
                                    {scoreItem?.grade?.toUpperCase()}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="cell-comments">
                              <textarea
                                className="comment-field"
                                value={currentEvaluation.comment || ''}
                                onChange={(e) =>
                                  handleChange(employeeIndex, division.kpiDivisionId, 'comment', e.target.value)
                                }
                                placeholder={`Enter assessment for ${division.divisionName}...`}
                                rows={3}
                                disabled={monthlyValue?.status == 'Approved' || monthlyValue?.status == 'PendingReview'}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </main>

        {monthlyValue?.monthlyTargetComment?.length > 0 && (
          <>
            <PerformanceCommentHistory comment={{ comments: monthlyValue?.monthlyTargetComment }} />
          </>
        )}
        {monthlyValue?.status !== 'Approved' && monthlyValue?.status !== 'PendingReview' && (
          <>
            <Form form={form} layout="vertical">
              <Card className="comment-card">
                <TextArea name="comment" rows={4} placeholder={t('add_comment_area')} />
              </Card>
            </Form>
          </>
        )}
        {monthlyValue?.status !== 'Approved' && monthlyValue?.status !== 'PendingReview' && (
          <footer className="action-panel">
            <div className="action-buttons">
              <button type="button" className="action-btn primary-btn" onClick={handleSubmit} disabled={isLoading}>
                <span className="btn-text">{t('send_request')}</span>
              </button>
            </div>
          </footer>
        )}
      </div>
      <EvaluationModalConfig modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </StyledEvaluationForm>
  );
}
