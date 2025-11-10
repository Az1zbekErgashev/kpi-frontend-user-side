import { Form } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Select, SelectOption, Table } from 'ui';
import { StyledEvaluationModalConfig } from './style';
import useQueryApiClient from 'utils/useQueryApiClient';

interface ModalConfig {
  userId?: number;
  month?: string;
  year?: string;
  open: boolean;
  userName?: string;
  position?: string;
  role?: string;
}

interface props {
  modalConfig: ModalConfig;
  setModalConfig: React.Dispatch<React.SetStateAction<ModalConfig>>;
}

export function EvaluationModalConfig({ modalConfig, setModalConfig }: props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState<any>({
    userId: modalConfig.userId,
    month: modalConfig.month,
    year: modalConfig.year,
  });

  const months = [
    { value: '1', label: t('january') },
    { value: '2', label: t('february') },
    { value: '3', label: t('march') },
    { value: '4', label: t('april') },
    { value: '5', label: t('may') },
    { value: '6', label: t('june') },
    { value: '7', label: t('july') },
    { value: '8', label: t('august') },
    { value: '9', label: t('september') },
    { value: '10', label: t('october') },
    { value: '11', label: t('november') },
    { value: '12', label: t('december') },
  ];

  const onValuesChange = (value: any) => {
    setQueryParams((prev: any) => ({
      ...prev,
      ...value,
      year: modalConfig.year,
      userId: modalConfig.userId,
    }));
  };

  useEffect(() => {
    if (modalConfig.open) {
      const initialValues: any = {
        year: dayjs(`${modalConfig.year}-01-01`),
      };
      initialValues.month = modalConfig.month;

      form.setFieldsValue(initialValues);
    }
  }, [form, modalConfig.open]);

  const columns = [
    {
      title: t('divisionName'),
      dataIndex: 'divisionName',
      key: 'divisionName',
    },
    {
      title: t('ratio'),
      dataIndex: 'ratio',
      key: 'ratio',
    },
    {
      title: t('grade'),
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: t('comment'),
      dataIndex: 'comment',
      key: 'comment',
    },
  ];

  const {
    data: evaluationData,
    refetch: getUseData,
    appendData,
  } = useQueryApiClient({
    request: {
      url: '/api/evaluation/member',
      disableOnMount: true,
      data: queryParams,
    },
  });

  useEffect(() => {
    if (modalConfig.open && queryParams.userId) {
      getUseData();
    } else if (modalConfig.open && !queryParams.userId) {
      appendData({ userId: modalConfig.userId, month: modalConfig.month, year: modalConfig.year });
    }
  }, [queryParams, modalConfig.open]);

  return (
    <Modal footer={[]} open={modalConfig.open} onCancel={() => setModalConfig({ open: false })}>
      <StyledEvaluationModalConfig>
        <div className="content">
          <div className="employee-info">
            <div className="info-row">
              <span className="label">{t('employee')}:</span>
              <span className="value">{modalConfig.userName}</span>
            </div>
            <div className="info-row">
              <span className="label">{t('position')}:</span>
              <span className="value">{modalConfig.position && t(modalConfig.position)}</span>
            </div>
            <div className="info-row">
              <span className="label">{t('role')}:</span>
              <span className="value">{modalConfig.role && t(modalConfig.role)}</span>
            </div>
          </div>
          <div>
            <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
              <Select style={{ width: '150px' }} placeholder={t('please_select_month')} label={t('month')} name="month">
                {months.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.label}
                  </SelectOption>
                ))}
              </Select>
            </Form>
          </div>
        </div>

        <Table columns={columns} dataSource={evaluationData?.data?.[0]?.divisionEvaluations ?? []} />
      </StyledEvaluationModalConfig>
    </Modal>
  );
}