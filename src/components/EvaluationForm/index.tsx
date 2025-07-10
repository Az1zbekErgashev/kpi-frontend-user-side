'use client';

import { useState } from 'react';
import { StyledEvaluationForm } from './style';
import { useParams } from 'react-router-dom';
import useQueryApiClient from 'utils/useQueryApiClient';

interface DivisionEvaluation {
  kpiDivisionId: number;
  divisionName: string;
  grade?: string;
  modifier?: string;
  score?: number;
  comment?: string;
  id?: number;
}

interface Employee {
  employeeId: number;
  fullName: string;
  divisionEvaluations: DivisionEvaluation[];
}

interface ApiResponse {
  status: boolean;
  data: Employee[];
}

interface EvaluationInput {
  employeeId: number;
  fullName: string;
  evaluations: {
    [kpiDivisionId: number]: {
      grade?: string;
      modifier?: string;
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
  grade: string;
  modifier: string;
  score: number;
  comment: string;
}

const gradeLetters = ['A', 'B', 'C'];
const gradeSigns = ['0', '+', '-'];

export function EvaluationForm() {
  const params = useParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationInput[]>([]);
  const [divisions, setDivisions] = useState<DivisionEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
              grade: div.grade || 'A',
              score: div.score || 100,
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
    field: 'grade' | 'modifier' | 'score' | 'comment',
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
            grade: evaluation.grade || 'A',
            modifier: evaluation.modifier || '+',
            score: evaluation.score || 100,
            comment: evaluation.comment || '',
          });
        });
      });

      console.log(submitData);

      appendData(submitData);
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
    },
    onError(error) {
      console.error('Submit error:', error);
      alert('Error submitting evaluation');
    },
  });
  console.log(evaluations);

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
        <header className="page-header">
          <div className="header-content">
            <h1 className="main-title">Employee Performance Evaluation</h1>
            <p className="main-subtitle">
              KPI Division Assessment Report - {params?.year}/{params?.month}
            </p>
          </div>
        </header>

        <main className="evaluation-grid">
          {divisions.map((division) => (
            <section key={division.kpiDivisionId} className="evaluation-card">
              <header className="card-header">
                <div className="category-info">
                  <h2 className="category-name">{division.divisionName}</h2>
                  <span className="category-id">ID: {division.kpiDivisionId}</span>
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
                      <th className="th-score">Score</th>
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
                                value={currentEvaluation.grade || 'A'}
                                onChange={(e) =>
                                  handleChange(employeeIndex, division.kpiDivisionId, 'grade', e.target.value)
                                }
                              >
                                {gradeLetters.map((grade) => (
                                  <option key={grade} value={grade}>
                                    {grade}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="cell-score">
                              <input
                                type="number"
                                className="score-input"
                                min="0"
                                max="100"
                                value={currentEvaluation.score || 100}
                                onChange={(e) =>
                                  handleChange(
                                    employeeIndex,
                                    division.kpiDivisionId,
                                    'score',
                                    Number.parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="0-100"
                              />
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

        <footer className="action-panel">
          <div className="action-buttons">
            <button type="button" className="action-btn primary-btn" onClick={handleSubmit} disabled={isLoading}>
              <span className="btn-text">{isLoading ? 'Submitting...' : 'Update Evaluation'}</span>
            </button>
          </div>
        </footer>
      </div>
    </StyledEvaluationForm>
  );
}
