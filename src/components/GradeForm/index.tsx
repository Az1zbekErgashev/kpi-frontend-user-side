import { useState, useEffect } from 'react';
import React from 'react';
import { StyledGradeForm } from './style';

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

const mockApiResponse: ApiResponse = {
  students: [
    {
      id: '1',
      room: 'WS81',
      class: 'SDC',
      name: 'John Smith',
      position: 'Manager',
      department: 'Research',
      type: 'Full-time',
      subject: 'Software Development',
      date: '31.12.2024',
      grades: {
        basic_performance: { 1: 'A', 2: 'B', 3: 'A', 4: 'B', 5: 'A' },
        performance_evaluation: { 1: 'A', 2: 'B', 3: 'A', 4: 'A' },
        attendance_check: { 1: 'A', 2: 'A', 3: 'B', 4: 'A' },
        training_participation: { 1: 'B', 2: 'A', 3: 'A' },
      },
    },
    {
      id: '2',
      room: 'WS81',
      class: 'SDC',
      name: 'Sarah Johnson',
      position: 'Senior Dev',
      department: 'Research',
      type: 'Full-time',
      subject: 'Development',
      date: '20.12.2021',
      grades: {
        basic_performance: { 1: 'B', 2: 'A', 3: 'A', 4: 'A' },
        performance_evaluation: { 1: 'A', 2: 'A', 3: 'A' },
        attendance_check: { 1: 'A', 2: 'A', 3: 'A', 4: 'A' },
        training_participation: { 1: 'A', 2: 'A' },
      },
    },
    {
      id: '3',
      room: 'WS81',
      class: 'LTC',
      name: 'Mike Wilson',
      position: 'Team Lead',
      department: 'Development',
      type: 'Full-time',
      subject: 'Analysis',
      date: '15.04.2019',
      grades: {
        basic_performance: { 1: 'C', 2: 'B', 3: 'B', 4: 'C' },
        performance_evaluation: { 1: 'B', 2: 'C', 3: 'B' },
        attendance_check: { 1: 'B', 2: 'B', 3: 'C' },
        training_participation: { 1: 'C', 2: 'B' },
      },
    },
  ],
  evaluationPeriods: [
    {
      id: 'basic_performance',
      name: 'Basic Work Performance',
      percentage: 40,
      periods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      description: 'Daily work quality and basic responsibilities',
    },
    {
      id: 'performance_evaluation',
      name: 'Performance Evaluation',
      percentage: 85,
      periods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      description: 'Comprehensive performance assessment',
    },
    {
      id: 'attendance_check',
      name: 'Attendance & Punctuality',
      percentage: 13,
      periods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      description: 'Attendance record and punctuality',
    },
    {
      id: 'training_participation',
      name: 'Training & Development',
      percentage: 15,
      periods: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      description: 'Training programs participation',
    },
  ],
  statistics: {
    totalStudents: 3,
    gradeDistribution: { A: 1, B: 2, C: 0, D: 0, F: 0 },
  },
};

const GRADE_POINTS = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

export function GradeDisplay() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Single API call to fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Replace with your actual API endpoint
        // const response = await fetch("/api/grades/all")
        // const apiData: ApiResponse = await response.json()

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData(mockApiResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate annual grade based on weighted average
  const calculateAnnualGrade = (
    student: ApiResponse['students'][0],
    evaluationPeriods: ApiResponse['evaluationPeriods']
  ): string => {
    let totalWeightedPoints = 0;
    let totalWeight = 0;

    evaluationPeriods.forEach((evaluation) => {
      const studentGrades = student.grades[evaluation.id];
      if (studentGrades) {
        // Get all non-null grades for this evaluation
        const validGrades = Object.values(studentGrades).filter((grade): grade is string => grade !== null);

        if (validGrades.length > 0) {
          // Calculate average grade points for this evaluation category
          const totalPoints = validGrades.reduce(
            (sum, grade) => sum + (GRADE_POINTS[grade as keyof typeof GRADE_POINTS] || 0),
            0
          );
          const averagePoints = totalPoints / validGrades.length;

          // Apply weight
          const weight = evaluation.percentage / 100;
          totalWeightedPoints += averagePoints * weight;
          totalWeight += weight;
        }
      }
    });

    if (totalWeight === 0) return 'F';

    // Calculate final weighted average
    const finalPoints = totalWeightedPoints / totalWeight;

    // Convert back to letter grade
    if (finalPoints >= 3.5) return 'A';
    if (finalPoints >= 2.5) return 'B';
    if (finalPoints >= 1.5) return 'C';
    if (finalPoints >= 0.5) return 'D';
    return 'F';
  };

  // Get grade for specific student, period, and evaluation
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
                <th rowSpan={2} className="student-info-header">
                  Student Information
                </th>
                {data.evaluationPeriods.map((period) => (
                  <th key={period.id} colSpan={period.periods.length} className={`category-cell category-${period.id}`}>
                    <div className="category-content">
                      <div className="category-name">{period.name}</div>
                      <div className="category-percentage">{period.percentage}%</div>
                      <div className="category-description">{period.description}</div>
                    </div>
                  </th>
                ))}
                <th rowSpan={2} className="annual-header">
                  Annual Grade
                </th>
              </tr>

              {/* Second header row - Period numbers */}
              <tr className="period-header">
                {data.evaluationPeriods.map((evaluation) =>
                  evaluation.periods.map((period) => (
                    <th key={`${evaluation.id}-${period}`} className={`period-cell category-${evaluation.id}`}>
                      {period}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.students.map((student) => {
                const annualGrade = calculateAnnualGrade(student, data.evaluationPeriods);
                return (
                  <tr key={student.id} className="student-row">
                    {/* Student Information */}
                    <td className="student-info-cell">
                      <div className="student-details">
                        <div className="student-main">
                          <span className="room">{student.room}</span>
                          <span className="class">{student.class}</span>
                          <span className="name">{student.name}</span>
                        </div>
                        <div className="student-secondary">
                          <span className="position">{student.position}</span>
                          <span className="department">{student.department}</span>
                        </div>
                        <div className="student-extra">
                          <span className="subject">{student.subject}</span>
                          <span className="date">{student.date}</span>
                        </div>
                      </div>
                    </td>

                    {/* Grade cells for each evaluation period */}
                    {data.evaluationPeriods.map((evaluation) =>
                      evaluation.periods.map((period) => {
                        const grade = getGrade(student, evaluation.id, period);
                        return (
                          <td
                            key={`${evaluation.id}-${period}`}
                            className={`grade-cell grade-${grade.toLowerCase()} category-${evaluation.id}`}
                            title={`${student.name} - ${evaluation.name} - Period ${period}: ${grade}`}
                          >
                            {grade}
                          </td>
                        );
                      })
                    )}

                    {/* Annual Grade */}
                    <td className="annual-cell">
                      <div className={`annual-grade grade-${annualGrade.toLowerCase()}`}>{annualGrade}</div>
                      <div className="annual-label">Final</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Statistics */}
        <div className="statistics-container">
          <div className="stats-card">
            <h3>Grade Statistics</h3>
            <div className="stats-content">
              <div className="total-students">
                <span className="stats-number">{data.statistics.totalStudents}</span>
                <span className="stats-label">Total Students</span>
              </div>
              <div className="grade-distribution">
                <h4>Annual Grade Distribution:</h4>
                {(() => {
                  // Calculate actual annual grade distribution
                  const annualDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
                  data.students.forEach((student) => {
                    const annualGrade = calculateAnnualGrade(student, data.evaluationPeriods);
                    annualDistribution[annualGrade]++;
                  });
                  return Object.entries(annualDistribution).map(([grade, count]) => (
                    <div key={grade} className="distribution-item">
                      <span className={`grade-badge grade-${grade.toLowerCase()}`}>{grade}</span>
                      <span className="count">{count} students</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="legend">
          <div className="legend-content">
            <span className="legend-title">Grade Legend:</span>
            <div className="legend-item">
              <div className="legend-color grade-a"></div>
              <span>A (Excellent - 3.5+ points)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color grade-b"></div>
              <span>B (Good - 2.5-3.4 points)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color grade-c"></div>
              <span>C (Satisfactory - 1.5-2.4 points)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color grade-d"></div>
              <span>D (Needs Improvement - 0.5-1.4 points)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color grade-f"></div>
              <span>F (Failing - &lt;0.5 points)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color grade--"></div>
              <span>- (Not Evaluated)</span>
            </div>
          </div>
        </div>
      </div>
    </StyledGradeForm>
  );
}
