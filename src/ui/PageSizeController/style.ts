import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ControllerWrapper = styled.div`
  position: relative;
`;

export const StyledPageSizeController = styled.div`
  background: linear-gradient(to right, rgba(103, 158, 226, 0.58), rgb(69, 138, 223));
  position: fixed;
  right: 0;
  bottom: 300px;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px 0 0 20px;
  cursor: pointer;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(109, 40, 217, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(to right, rgba(103, 158, 226, 0.64), rgb(52, 125, 214));
    box-shadow: 0 4px 12px rgba(109, 40, 217, 0.3);
  }
`;

export const StyledPopup = styled.div`
  position: fixed;
  right: 0;
  bottom: 60px;
  width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: ${slideIn} 0.3s ease forwards;
  padding: 16px;
  &.open {
    animation: ${slideIn} 0.3s ease forwards;
  }
`;

export const PopupHeader = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #1f2937;
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

export const PageSizeOption = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-weight: ${(props) => (props.selected ? '600' : '400')};
  background: ${(props) => (props.selected ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#f3f4f6')};
  color: ${(props) => (props.selected ? 'white' : '#4b5563')};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.selected ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e5e7eb')};
    transform: scale(1.05);
  }
`;

export const InfoText = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ConfirmButton = styled.button`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
`;

export const CloseButton = styled.button`
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;
