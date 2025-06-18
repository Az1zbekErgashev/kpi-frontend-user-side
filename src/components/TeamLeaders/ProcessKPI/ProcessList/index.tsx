import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Table } from 'ui';

interface props {
  users: any;
}
export function ProcessList({ users }: props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
        <h1>Progress on establishing personal KPI for 2024
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
