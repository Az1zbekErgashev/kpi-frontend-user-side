import React, { useEffect } from 'react';
import { StyledTeamLeadersList } from './style';
import { Form } from 'antd';
import { DatePicker, Select, SelectOption } from 'ui';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

interface props {
  month: boolean;
  handleValueChange: (value: any) => void;
  activeTab: string;
}

export function TeamLeadersFilter({ month, handleValueChange, activeTab }: props) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const currentYear = dayjs().year();
  const [searchParams, setSearchParams] = useSearchParams();

  const yearFromQuery = searchParams.get('year') || currentYear;
  const monthFromQuery = searchParams.get('month') || (dayjs().month() + 1).toString();

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

  useEffect(() => {
    const initialValues: any = {
      year: dayjs(`${yearFromQuery}-01-01`),
    };
    if (month) initialValues.month = monthFromQuery;

    form.setFieldsValue(initialValues);
  }, [form, activeTab]);

  const onValuesChange = (changed: any, all: any) => {
    const newParams = new URLSearchParams(searchParams);
    if (all.year) {
      newParams.set('year', dayjs(all.year).year().toString());
    }
    if (month && all.month) {
      newParams.set('month', all.month.toString());
    }
    setSearchParams(newParams);
    handleValueChange(all);
  };

  return (
    <StyledTeamLeadersList>
      <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
        <DatePicker
          label={t('select_year')}
          picker="year"
          name="year"
          disabledDate={(current) => current && current.year() > currentYear}
          allowClear={false}
        />
        {month && (
          <Select style={{ width: '150px' }} placeholder={t('please_select_month')} label={t('month')} name="month">
            {months.map((item, index) => (
              <SelectOption key={index} value={item.value}>
                {item.label}
              </SelectOption>
            ))}
          </Select>
        )}
      </Form>
    </StyledTeamLeadersList>
  );
}