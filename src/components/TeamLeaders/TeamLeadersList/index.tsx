import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Table } from 'ui';
import { ProcessList } from '../ProcessKPI/ProcessList';
import { ProcessFilter } from '../ProcessKPI/ProcessFilter';
import { Navbar } from 'components/Navbar';
import { Tabs } from 'antd';

interface props {
  users: any;
}
export function TeamLeadersList({ users }: props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('1');

  const columns: ColumnsType = [
    {
      title: t('No'),
      dataIndex: 'No',
      key: 'No',
    },
    {
      title: t('room'),
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: t('team'),
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: t('user_name'),
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: t('progress_status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('hour'),
      dataIndex: 'hour',
      key: 'hour',
    },
  ];

  return (
    <div>
      <div>
        <h1>2024 WSU 2nd Team KPI Establishment Progress
        </h1>
      </div>
      <Table
        onRow={(record: any) => ({
          onClick: () => navigate(`/goal/user-id/${record.teamId}/${record.year}`),
        })}
        columns={columns}
        dataSource={users ?? []}
      />
      <br />
    </div>
  );
}
