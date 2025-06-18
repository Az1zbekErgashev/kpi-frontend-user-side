import React from 'react';
import { Table, Typography } from 'antd';
const { Title } = Typography;

export const TeamLeaderDetail: React.FC = () => {
  const dataSource = [
    {
      key: '1',
      division: 'Establish Goals',
      goals: (
        <>
          <input type="checkbox" checked /> Performance evaluation tailored to the characteristics of each team
          <ul>
            <li>- Establish goals in a quantitative direction</li>
            <li>- Write down one target value (same for team and individual)</li>
          </ul>
          (Monthly) Contents on team performance (leader evaluation)
          <br />
          (Monthly) Contents on individual performance (individual evaluation)
          <br />
          (Total ratio 40%)
        </>
      ),
    },
    {
      key: '2',
      division: 'Performance Evaluation',
      goals: (
        <>
          <input type="checkbox" checked /> Team contribution and work attitude evaluation
          <ul>
            <li>- Write 1 item as target value</li>
          </ul>
          (monthly) Contents on compliance with team contribution and work attitude (individual evaluation)
          <br />
          (Total ratio 30%)
        </>
      ),
    },
    {
      key: '3',
      division: 'Basic Attendance Evaluation',
      goals: (
        <>
          <input type="checkbox" checked /> Basic Attendance Evaluation
          <ul>
            <li>(Monthly) Team Lateness Times (Leader Evaluation)</li>
            <li>(Monthly) Individual Lateness Times (Individual Evaluation)</li>
          </ul>
          (Total Ratio 15%)
        </>
      ),
    },
    {
      key: '4',
      division: 'Capacity Building',
      goals: (
        <>
          <input type="checkbox" checked /> Strengthening of individual expertise
          <ul>
            <li>(year-end) Certification acquisition and training participation rate (leader evaluation)</li>
            <li>(monthly cumulative) Certification acquisition and training participation achievement (individual evaluation)</li>
          </ul>
          (Total ratio 15%)
        </>
      ),
    },
  ];

  const columns = [
    {
      title: 'division',
      dataIndex: 'division',
      key: 'division',
      width: '20%',
      style: { background: '#e6e6fa', padding: '8px' },
    },
    {
      title: '2025 Performance Goals',
      dataIndex: 'goals',
      key: 'goals',
      style: { padding: '8px' },
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f0f5',
        padding: '24px',
      }}
    >
      <div style={{ width: '80%', maxWidth: '1200px', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
        <Title level={2} style={{ color: '#4B0082', textAlign: 'center', marginBottom: '16px' }}>
          Status of WSU 1st Team KPI Establishment for 2025
        </Title>
        <a href="#" style={{ color: '#4B0082', textDecoration: 'underline', marginBottom: '16px', display: 'block', textAlign: 'center' }}>
          View WSB Office KPI Goals for 2025
        </a>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          style={{ marginTop: '16px' }}
        />
      </div>
    </div>
  );
};

