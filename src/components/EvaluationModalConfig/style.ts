import styled from 'styled-components';

export const StyledEvaluationModalConfig = styled.div`
  .content {
    display: flex;
    justify-content: space-between;
  }

  /* Employee Info */
  .employee-info {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 6px;
    margin-bottom: 24px;
  }

  .info-row {
    display: flex;
    margin-bottom: 8px;
    gap: 18px;
  }

  form {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 30px;
  }

  .info-row:last-child {
    margin-bottom: 0;
  }

  .label {
    font-weight: 500;
    color: #666;
    width: 80px;
    flex-shrink: 0;
  }
`;
