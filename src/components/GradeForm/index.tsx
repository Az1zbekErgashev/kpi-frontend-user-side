'use client';

import React from 'react';

import { useState } from 'react';
import useQueryApiClient from 'utils/useQueryApiClient';
import { StyledGradeForm } from './style';
import { useParams } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApiResponse {
  students: {
    id: string;
    room: string;
    class: string;
    name: string;
    position: string;
    department: string;
    type: string;
    subject: string;
    date: string;
    grades: {
      [evaluationId: string]: {
        [period: number]: string | null;
      };
    };
    finalScore: number | null;
    finalGrade?: string; // Numerical annual grade
    divisions: {
      divisionId: string;
      average: number;
      adjusted: number;
      weighted: number;
      ratio?: number;
      grade?: string;
    }[];
  }[];
  evaluationPeriods: {
    id: string;
    name: string;
    percentage: number;
    periods: number[];
    description: string;
  }[];
  statistics: {
    totalStudents: number;
    gradeDistribution: Record<string, number>;
  };
}
const generateDivisionColor = (index: number) => {
  const colors = [
    { bg: '#fef3c7', text: '#92400e' },
    { bg: '#dbeafe', text: '#1e40af' },
    { bg: '#f3e8ff', text: '#7c3aed' },
    { bg: '#dcfce7', text: '#166534' },
    { bg: '#fce7f3', text: '#be185d' },
    { bg: '#ecfdf5', text: '#059669' },
    { bg: '#fef2f2', text: '#dc2626' },
    { bg: '#f0f9ff', text: '#0369a1' },
    { bg: '#fffbeb', text: '#d97706' },
    { bg: '#f5f3ff', text: '#6366f1' },
  ];

  return colors[index % colors.length];
};

interface props {
  teamEvaluation: boolean;
}

export function GradeDisplay({ teamEvaluation }: props) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { t } = useTranslation();

  const {} = useQueryApiClient({
    request: {
      url: !teamEvaluation
        ? `/api/evaluation/all-evaluation?year=${params.year}`
        : `/api/evaluation/evaluation-by-year-team?year=${params.year}`,
    },
    onSuccess(response) {
      setData(response.data);
    },
    onError() {
      setError('Failed to fetch data');
    },
    onFinally() {
      setLoading(false);
    },
  });

  const getGrade = (student: ApiResponse['students'][0], evaluationId: string, period: number): string => {
    return student.grades[evaluationId]?.[period] || '-';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Loading grade data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return <div className="error-container">No data available</div>;
  }

  return (
    <StyledGradeForm>
      <div className="grade-system">
        <div className="table-container">
          <table className="grade-table">
            <thead>
              <tr className="category-header">
                <th rowSpan={3} className="student-info-header">
                  <div className="logo-section">
                    <div className="logo-container">
                      <div className="logo-icon">
                        <Zap className="logo-svg" />
                      </div>
                      <div className="logo-text">
                        <h2>KPI</h2>
                        <span>{t('evaluations')}</span>
                      </div>
                    </div>
                    <div className="logo-glow"></div>
                  </div>
                </th>
                {data?.evaluationPeriods?.map((period) => (
                  <th key={period.id} colSpan={period.periods.length} className={`category-cell category-${period.id}`}>
                    <div className="category-content">
                      <div className="category-name">{period.name}</div>
                      <div className="category-percentage">{period.percentage}%</div>
                    </div>
                  </th>
                ))}
                <th rowSpan={3} className="annual-header">
                  <div className="category-content">
                    <div className="category-name">{t('final_result')}</div>
                    <div className="category-percentage">100%</div>
                  </div>
                </th>

                {(() => {
                  const missingDiv = data?.students
                    .flatMap((student) => student.divisions)
                    .find((divs) => !data.evaluationPeriods?.some((div) => div.id === divs.divisionId));

                  console.log(missingDiv);

                  return missingDiv ? (
                    <th rowSpan={3} className="annual-header">
                      <div className="category-content">
                        <div className="category-name mission-content">{t('joined_division')}</div>
                        <div className="category-percentage">{missingDiv.ratio}%</div>
                      </div>
                    </th>
                  ) : null;
                })()}
              </tr>

              <tr className="period-header">
                {data?.evaluationPeriods?.map((evaluation) =>
                  evaluation.periods.map((period) => (
                    <th key={`${evaluation.id}-${period}`} className={`period-cell category-${evaluation.id}`}>
                      {period}
                    </th>
                  ))
                )}
              </tr>

              <tr className="avg-header">
                {data?.evaluationPeriods?.map((evaluation, evaluationIndex) => {
                  const divisionColor = generateDivisionColor(evaluationIndex);

                  return evaluation?.periods?.map((period, index) => (
                    <th
                      key={`avg-${evaluation.id}-${period}`}
                      style={{
                        backgroundColor: index === 0 ? divisionColor.bg : '#f0f9ff',
                        color: index === 0 ? divisionColor.text : '#1e40af',
                      }}
                      className={`avg-cell category-${evaluation.id}`}
                    ></th>
                  ));
                })}
              </tr>
            </thead>

            <tbody>
              {data.students.map((student) => (
                <React.Fragment key={student.id}>
                  <tr className="student-row">
                    <td className="student-info-cell">
                      <div className="student-details">
                        <div className="student-main">
                          <span className="name">{student.name}</span>
                        </div>
                        <div className="student-secondary">
                          <span className="position">{student.position}</span>
                          <span className="department">{student.department}</span>
                        </div>
                        <div className="student-extra">
                          <span className="date">{student.date}</span>
                        </div>
                      </div>
                    </td>

                    {data.evaluationPeriods.map((evaluation) =>
                      evaluation.periods.map((period) => {
                        const grade = getGrade(student, evaluation.id, period);
                        return (
                          <td
                            key={`${evaluation.id}-${period}`}
                            className={`grade-cell grade-${grade.toLowerCase()}`}
                            title={`${student.name} - ${evaluation.name} - Period ${period}: ${grade}`}
                          >
                            {grade}
                          </td>
                        );
                      })
                    )}

                    <td className="annual-cell">
                      <div className="annual-grade">{student.finalScore ?? '-'}</div>
                      <div className="annual-label final-grade">{student.finalGrade}</div>
                    </td>
                    {(() => {
                      const missingDiv = student.divisions.find(
                        (divs) => !data.evaluationPeriods?.some((div) => div.id === divs.divisionId)
                      );

                      return missingDiv ? (
                        <td className="annual-cell">
                          <div className="annual-grade">{missingDiv.weighted ?? '-'}</div>
                          <div className="annual-label final-grade">{missingDiv.grade}</div>
                        </td>
                      ) : null;
                    })()}
                  </tr>

                  <tr className="student-avg-row">
                    <td className="avg-label-cell">
                      <div className="avg-student-label">AVG</div>
                    </td>

                    {data.evaluationPeriods.map((evaluation) => {
                      const avgValue = student.divisions?.find((div) => div.divisionId === evaluation.id)?.average || 0;
                      const divisionLength = evaluation.periods.length;
                      const middleIndex = Math.floor(divisionLength / 2);

                      return evaluation.periods.map((period, index) => (
                        <td key={`student-avg-${student.id}-${evaluation.id}-${period}`} className="avg-period-cell">
                          {index === middleIndex ? (
                            <div className="avg-value-display">{avgValue}</div>
                          ) : (
                            <div className="avg-empty-cell"></div>
                          )}
                        </td>
                      ));
                    })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StyledGradeForm>
  );
}
