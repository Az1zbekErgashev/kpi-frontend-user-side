import React from 'react';
import { Form } from 'antd';
import { DatePicker, Input, Select, SelectOption } from 'ui';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { StyledProcessList } from './style';

interface props {
  rooms?: { id: number; name: string }[];
  teams?: { id: number; name: string }[];
}
export function ProcessFilter({ rooms, teams }: props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  return (
    <StyledProcessList>
      <Form form={form} layout="vertical">
        <Select>
          <SelectOption value="">{t('please_select_room')}</SelectOption>
        </Select>
      </Form>
    </StyledProcessList>
  );
}
