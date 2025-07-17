'use client';

import { useState } from 'react';
import { StyledEvaluationForm } from './style';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';
import { PerformanceCommentHistory } from 'components';
import { Card, Form } from 'antd';
import { TextArea } from 'ui';
import { useTranslation } from 'react-i18next';

interface DivisionEvaluation {
  kpiDivisionId: number;
  divisionName: string;
  ratio: any;
  grade?: string;
  score?: number;
  comment?: string;
  id?: number;
}

interface Employee {
  employeeId: number;
  fullName: string;
  divisionEvaluations: DivisionEvaluation[];
}

interface EvaluationInput {
  employeeId: number;
  fullName: string;
  evaluations: {
    [kpiDivisionId: number]: {
      grade?: string;
      score?: number;
      comment?: string;
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
  score?: number;
  comment: string;
}

const gradeLetters = ['A', 'B', 'C'];

interface props {
  monthlyValue: any;
  onSubmit: any;
  setComment: any;
}
export function EvaluationForm({ monthlyValue, onSubmit, setComment }: props) {
  const params = useParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationInput[]>([]);
  const [divisions, setDivisions] = useState<DivisionEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {} = useQueryApiClient({
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
            });
          }
        });
      });

      setDivisions(uniqueDivisions);

      const initialEvaluations: EvaluationInput[] = response?.data?.map((employee: any) => ({
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        evaluations: employee.divisionEvaluations.reduce(
          (acc: any, div: any) => ({
            ...acc,
            [div.kpiDivisionId]: {
              id: div.id || 0,
              grade: div.grade,
              score: div.score,
              comment: div.comment || '',
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
    field: 'grade' | 'score' | 'comment',
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
          submitData.push({
            id: evaluation.id || 0,
            userId: employee.employeeId,
            kpiDivisionId: Number.parseInt(kpiDivisionId),
            year: params?.year,
            month: params?.month,
            grade: evaluation.grade == '-' ? undefined : evaluation.grade,
            score: evaluation.score,
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
      alert('Evaluation submitted successfully!');
      navigate(-1);
    },
    onError(error) {
      alert('Error submitting evaluation');
    },
  });

  if (employees.length === 0) {
    return (
      <StyledEvaluationForm>
        <div className="evaluation-container">
          <div className="loading">Loading employees...</div>
        </div>
      </StyledEvaluationForm>
    );
  }

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
                <p className="category-description">KPI Division Assessment</p>
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
                              />
                            </td>
                            <td className="cell-employee">
                              <div className="employee-details">
                                <div className="employee-name">{employee.fullName}</div>
                                <div className="employee-id">ID: {employee.employeeId}</div>
                              </div>
                            </td>
                            <td className="cell-grade">
                              <select
                                className="grade-selector"
                                value={currentEvaluation.grade}
                                onChange={(e) =>
                                  handleChange(employeeIndex, division.kpiDivisionId, 'grade', e.target.value)
                                }
                                defaultValue={undefined}
                              >
                                <option value={undefined}>-</option>
                                {gradeLetters.map((grade) => (
                                  <option key={grade} value={grade}>
                                    {grade}
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

        {location.pathname.includes('team-performance') && (
          <>
            <PerformanceCommentHistory comment={{ comments: monthlyValue?.monthlyTargetComment }} />
          </>
        )}
        {location.pathname.includes('team-performance') && (
          <>
            <Form
              onValuesChange={(changedValues) => {
                if (setComment && changedValues.comment !== undefined) {
                  setComment(changedValues.comment);
                }
              }}
              form={form}
              layout="vertical"
            >
              <Card className="comment-card">
                <TextArea name="comment" rows={4} placeholder={t('add_comment_area')} />
              </Card>
            </Form>
          </>
        )}

        <footer className="action-panel">
          <div className="action-buttons">
            <button type="button" className="action-btn primary-btn" onClick={handleSubmit} disabled={isLoading}>
              <span className="btn-text">Send Request</span>
            </button>
          </div>
        </footer>
      </div>
    </StyledEvaluationForm>
  );
}
