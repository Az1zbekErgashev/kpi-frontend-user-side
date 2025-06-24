import React from 'react';
import { StyledTeamLeadersList } from './style';
import { Form } from 'antd';
import { DatePicker, Select, SelectOption } from 'ui';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

interface props {
  month: boolean;
  handleValueChange: (value: any) => void;
}
export function TeamLeadersFilter({ month, handleValueChange }: props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const currentYear = dayjs().year();

  return (
    <StyledTeamLeadersList>
      <Form form={form} layout="vertical" onValuesChange={handleValueChange}>
        <DatePicker
          defaultValue={dayjs(`${currentYear}-01-01`)}
          label={t('year')}
          picker="year"
          name="year"
          disabledDate={(current) => current && current.year() > currentYear}
          allowClear={false}
        />
        {month && (
          <Select
            style={{ width: '150px' }}
            defaultValue={(dayjs().month() + 1).toString()}
            placeholder={t('please_select_month')}
            label={t('month')}
          >
            {months.map((item, index) => (
              <SelectOption key={index} value={item.value}>
                {t(item.label)}
              </SelectOption>
            ))}
          </Select>
        )}
      </Form>
    </StyledTeamLeadersList>
  );
}
