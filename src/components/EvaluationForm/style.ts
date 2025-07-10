import styled from 'styled-components';

export const StyledEvaluationForm = styled.div`
  .evaluation-container {
    margin: 0 auto;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    color: #1e293b;
    line-height: 1.5;
  }

  .loading {
    text-align: center;
    padding: 100px 0;
    font-size: 1.25rem;
    color: #64748b;
  }

  /* Header Section */
  .page-header {
    text-align: center;
    margin-bottom: 48px;
    padding: 32px 0;
    background: white;
    border-radius: 12px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.06);
  }

  .header-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .main-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
    letter-spacing: -0.025em;
  }

  .main-subtitle {
    font-size: 1.125rem;
    color: #64748b;
    font-weight: 400;
  }

  /* Control Panel */
  .control-panel {
    margin-bottom: 40px;
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.06);
  }

  .period-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    max-width: 600px;
    margin: 0 auto;
  }

  .input-group {
    display: block;
  }

  .input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  .period-input,
  .period-select {
    display: block;
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    background: white;
    color: #1e293b;
    transition: all 0.2s ease;
  }

  .period-input:focus,
  .period-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .evaluation-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 32px;
    margin-bottom: 40px;
    align-items: start;
  }

  .evaluation-card {
    background: white;
    border-radius: 12px;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.05),
      0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #e2e8f0;
    height: fit-content;
    display: grid;
    grid-template-rows: auto 1fr;
  }

  /* Card Header */
  .card-header {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    padding: 24px;
    color: white;
    min-height: 120px;
    display: grid;
    grid-template-rows: auto 1fr;
    align-content: start;
  }

  .category-info {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
  }

  .category-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
  }

  .category-id {
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }

  .category-description {
    font-size: 0.875rem;
    opacity: 0.9;
    margin: 0;
    line-height: 1.4;
  }

  /* Card Content */
  .card-content {
    padding: 0;
    display: block;
  }

  .assessment-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .table-header th {
    background: #f8fafc;
    padding: 16px 12px;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
    height: 50px;
    vertical-align: middle;
  }

  .th-index {
    width: 50px;
    text-align: center;
  }

  .th-employee {
    width: 140px;
  }

  .th-grade {
    width: 70px;
    text-align: center;
  }

  .th-modifier {
    width: 60px;
    text-align: center;
  }

  .th-score {
    width: 80px;
    text-align: center;
  }

  .th-comments {
    width: auto;
    min-width: 180px;
  }

  /* Table Body */
  .table-body .employee-row {
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.15s ease;
    height: 120px;
  }

  .employee-row:hover {
    background: #f8fafc;
  }

  .employee-row:last-child {
    border-bottom: none;
  }

  .employee-row td {
    padding: 16px 12px;
    vertical-align: top;
    height: 120px;
  }

  .cell-index {
    text-align: center;
    vertical-align: middle;
  }

  .index-number {
    display: inline-block;
    width: 32px;
    height: 32px;
    line-height: 32px;
    background: #e2e8f0;
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.875rem;
    color: #475569;
    text-align: center;
  }

  .employee-details {
    display: block;
    padding-top: 8px;
  }

  .employee-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.875rem;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .employee-id {
    font-size: 0.75rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.2;
  }

  .cell-grade,
  .cell-modifier,
  .cell-score {
    text-align: center;
    vertical-align: middle;
  }

  .grade-selector,
  .modifier-selector {
    width: 50px;
    padding: 8px 4px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    background: white;
    color: #1e293b;
    transition: all 0.15s ease;
  }

  .grade-selector:focus,
  .modifier-selector:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .modifier-selector {
    width: 45px;
  }

  .score-input {
    width: 70px;
    padding: 8px 6px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    background: white;
    color: #1e293b;
    transition: all 0.15s ease;
  }

  .score-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .cell-comments {
    vertical-align: top;
    padding-top: 12px;
  }

  .comment-field {
    width: 100%;
    padding: 12px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: inherit;
    color: #1e293b;
    resize: vertical;
    height: 80px;
    transition: all 0.15s ease;
  }

  .comment-field:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .comment-field::placeholder {
    color: #94a3b8;
    font-style: italic;
  }

  /* Action Panel */
  .action-panel {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.06);
  }

  .action-buttons {
    display: grid;
    grid-template-columns: auto auto;
    gap: 16px;
    justify-content: end;
  }

  .action-btn {
    padding: 14px 28px;
    border: 2px solid transparent;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s ease;
    background: none;
  }

  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .secondary-btn {
    background: #f8fafc;
    color: #475569;
    border-color: #e2e8f0;
  }

  .secondary-btn:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .primary-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border-color: #3b82f6;
  }

  .primary-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .btn-text {
    display: block;
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .evaluation-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  @media (max-width: 768px) {
    .evaluation-container {
      padding: 24px 16px;
    }

    .main-title {
      font-size: 2rem;
    }

    .period-selector {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .action-buttons {
      grid-template-columns: 1fr;
    }

    .assessment-table {
      font-size: 0.75rem;
    }

    .table-header th,
    .employee-row td {
      padding: 12px 8px;
      height: auto;
    }

    .employee-row {
      height: auto;
    }

    .comment-field {
      height: 60px;
    }

    .card-header {
      min-height: auto;
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    .card-header {
      padding: 16px;
    }

    .category-info {
      grid-template-columns: 1fr;
      gap: 8px;
      text-align: center;
    }

    .grade-selector,
    .modifier-selector,
    .score-input {
      width: 45px;
      font-size: 0.75rem;
    }

    .comment-field {
      height: 50px;
      font-size: 0.75rem;
    }
  }
`;
