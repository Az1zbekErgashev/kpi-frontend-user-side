import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/lib/table';
import { Table } from 'ui';
import dayjs from 'dayjs';
import { StyledCommentHistory } from 'components/CommentHistory/style';

interface props {
  comment: {
    comments: { status: string; content: string; createdAt: string }[];
  };
}
export function PerformanceCommentHistory({ comment }: props) {
  const { t } = useTranslation();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PendingReview':
        return {
          background: '#FFF8E1',
          color: '#FFB300',
        };
      case 'Returned':
        return {
          background: '#FDECEA', // soft red background
          color: '#E53935',
        };
      case 'Approved':
        return {
          background: '#E8F5E9', // soft green background
          color: '#43A047', // green text (Material green 600)
        };
      default:
        return {
          background: '#E3F2FD', // soft blue
          color: '#1976D2', // blue text
        };
    }
  };

  const columns: ColumnsType = [
    { dataIndex: 'no', key: 'no', title: t('no'), render: (type, record, index) => index + 1 },
    { dataIndex: 'content', key: 'content', title: t('comment') },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('status'),
      render: (status, _) => (
        <div className="status-wrapp">
          <div
            className="status"
            style={{ background: getStatusText(status).background, color: getStatusText(status).color }}
          >
            {t(status)}
          </div>
        </div>
      ),
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: t('createdAt'),
      render: (createdAt, _) => dayjs(createdAt).format('YYYY.MM.DD HH:MM'),
    },
  ];

  return (
    <StyledCommentHistory>
      <Table columns={columns} dataSource={comment?.comments ?? []} />
    </StyledCommentHistory>
  );
}
