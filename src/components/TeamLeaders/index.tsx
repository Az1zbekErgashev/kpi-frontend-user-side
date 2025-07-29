import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { TeamLeadersFilter } from './TeamLeadersFilter';
import { TeamLeadersList } from './TeamLeadersList';
import { ProcessList } from './ProcessKPI/ProcessList';
import { Tabs } from 'ui';
import dayjs from 'dayjs';
import useQueryApiClient from 'utils/useQueryApiClient';
import { useSearchParams } from 'react-router-dom';

interface initialQuery {
  name?: string;
  IsDeleted?: string | number;
  pageIndex: number;
  pageSize: number;
  year?: string;
}

interface initialQueryForPerformance {
  pageIndex: number;
  pageSize: number;
  year?: number | string;
  month?: number | string;
  userId?: number;
}

export function TeamLeadersTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || '1';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [queryParams, setQueryParams] = useState<initialQuery | null>({
    pageIndex: 1,
    pageSize: 10,
    year: searchParams.get('year') ? dayjs(searchParams.get('year'))?.format('YYYY-MM-DDTHH:mm:ss') : dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });
  const [queryParamsForPerformance, setQueryParamsForPerformance] = useState<initialQueryForPerformance | null>({
    pageIndex: 1,
    pageSize: 10,
    month: searchParams.get('month') ?? new Date().getMonth() + 1,
    year: searchParams.get('year') ?? new Date().getFullYear(),
  });
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;

  const handleValueChange = (value: any) => {
    setQueryParams((prev: any) => ({
      ...prev,
      ...value,
      year: dayjs(value.year).format('YYYY-MM-DDTHH:mm:ss'),
    }));
  };

  const handleValueChangePerformance = (value: any) => {
    setQueryParamsForPerformance((prev: any) => ({
      ...prev,
      ...value,
      year: dayjs(value.year).format('YYYY'),
    }));
  };

  useEffect(() => {
    if (parsedUser?.role == 'TeamLeader' && activeTab == '1') {
      getTeamLeaders();
    }
  }, [queryParams, activeTab]);

  const { data: teamMeambers, refetch: getTeamMeambers } = useQueryApiClient({
    request: {
      url: '/api/user/filter-teams',
      method: 'GET',
      data: queryParams,
      disableOnMount: true,
    },
  });

  const { data: teamLeaders, refetch: getTeamLeaders } = useQueryApiClient({
    request: {
      url: '/api/user/team-leader',
      method: 'GET',
      disableOnMount: true,
      data: queryParams,
    },
  });

  useEffect(() => {
    if (queryParams && activeTab == '1') {
      getTeamMeambers();
    }
  }, [queryParams, activeTab]);

  const { refetch: getAllMonthlyData, data: monthlyData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget/list',
      method: 'GET',
      disableOnMount: true,
      data: queryParamsForPerformance,
    },
  });

  const { data: monthlyDataTeamLeader, refetch: getMonthlyDataTeamLeader } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget/team-leader',
      data: queryParamsForPerformance,
      disableOnMount: true,
    },
  });

  useEffect(() => {
    if (activeTab == '2') {
      getAllMonthlyData();
    }
  }, [queryParamsForPerformance, activeTab]);

  useEffect(() => {
    if (parsedUser?.role == 'TeamLeader' && activeTab == '2') {
      getMonthlyDataTeamLeader();
    }
  }, [queryParamsForPerformance, activeTab]);

  const handleTabChange = (key: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('tab', key);
    setSearchParams(newSearchParams);
    setActiveTab(key);
    setQueryParams({ pageIndex: 1, pageSize: 10, year: dayjs().format('YYYY-MM-DDTHH:mm:ss') });
    setQueryParamsForPerformance({
      pageIndex: 1,
      pageSize: 10,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  const tabItems = [
    {
      key: '1',
      label: t('kpi_establishment'),
      children: (
        <div>
          <TeamLeadersFilter activeTab={activeTab} month={false} handleValueChange={handleValueChange} />
          {parsedUser?.role == 'TeamLeader' && (
            <TeamLeadersList isTeamLeader={true} role={parsedUser?.role} users={teamLeaders?.data} />
          )}
          <TeamLeadersList role={parsedUser?.role} users={teamMeambers?.data} isTeamLeader={false} />
        </div>
      ),
    },
    {
      key: '2',
      label: t('kpi_performance'),
      children: (
        <div>
          <TeamLeadersFilter activeTab={activeTab} handleValueChange={handleValueChangePerformance} month={true} />
          <ProcessList
            isTeamLeader={parsedUser?.role == 'TeamLeader' ? true : false}
            teamLeader={false}
            users={monthlyData?.data}
          />
          {parsedUser?.role == 'TeamLeader' && (
            <ProcessList
              isTeamLeader={parsedUser?.role == 'TeamLeader' ? true : false}
              teamLeader={true}
              users={monthlyDataTeamLeader?.data}
            />
          )}
        </div>
      ),
    },
  ];

  return <Tabs animated={true} type="line" activeKey={activeTab} onChange={handleTabChange} items={tabItems} />;
}
