import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { TeamLeadersFilter } from './TeamLeadersFilter';
import { TeamLeadersList } from './TeamLeadersList';
import { ProcessList } from './ProcessKPI/ProcessList';
import { Tabs } from 'ui';
import { useUser } from 'hooks/useUserState';
import dayjs from 'dayjs';
import useQueryApiClient from 'utils/useQueryApiClient';

interface initialQuery {
  name?: string;
  IsDeleted?: string | number;
  pageIndex: number;
  pageSize: number;
  year?: number;
}

interface initialQueryForPerformance {
  pageIndex: number;
  pageSize: number;
  year?: number;
  month?: number;
  userId?: number;
}

export function TeamLeadersTabs() {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [queryParams, setQueryParams] = useState<initialQuery | null>({ pageIndex: 1, pageSize: 10 });
  const [queryParamsForPerformance, setQueryParamsForPerformance] = useState<initialQueryForPerformance | null>({
    pageIndex: 1,
    pageSize: 10,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const { user } = useUser();

  const handleValueChange = (value: any) => {
    setQueryParams((prev: any) => ({
      ...prev,
      ...value,
      year: dayjs(value.year).format('YYYY-MM-DDTHH:mm:ss'),
    }));
  };

  useEffect(() => {
    if (user?.role == 'TeamLeader') {
      getTeamLeaders();
    }
  }, [user?.role, queryParams]);

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
    if (queryParams) {
      getTeamMeambers();
    }
  }, [queryParams]);

  const { refetch: getAllMonthlyData, data: monthlyData } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget/list',
      method: 'GET',
      disableOnMount: true,
      data: queryParamsForPerformance,
    },
  });

  const { data: monthlyDataTeamLeader } = useQueryApiClient({
    request: {
      url: '/api/monthlytarget/team-leader',
      data: queryParamsForPerformance,
    },
  });

  useEffect(() => {
    getAllMonthlyData();
  }, [queryParamsForPerformance]);

  const tabItems = [
    {
      key: '1',
      label: t('kpi_establishment'),
      children: (
        <div>
          <TeamLeadersFilter month={false} handleValueChange={handleValueChange} />
          {user?.role == 'TeamLeader' && <TeamLeadersList role={user?.role} users={teamLeaders?.data} />}
          <TeamLeadersList role={user?.role} users={teamMeambers?.data} />
        </div>
      ),
    },
    {
      key: '2',
      label: t('kpi_performance'),
      children: (
        <div>
          <TeamLeadersFilter handleValueChange={handleValueChange} month={true} />
          <ProcessList users={monthlyData?.data} />
          {user?.role == 'TeamLeader' && <ProcessList users={monthlyDataTeamLeader?.data} />}
        </div>
      ),
    },
  ];

  return <Tabs animated={true} type="line" activeKey={activeTab} onChange={setActiveTab} items={tabItems} />;
}
