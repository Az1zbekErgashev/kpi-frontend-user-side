import { t } from 'i18next';
import React, { useState } from 'react';
import { TeamLeadersFilter } from './TeamLeadersFilter';
import { TeamLeadersList } from './TeamLeadersList';
import { ProcessList } from './ProcessKPI/ProcessList';
import { Tabs } from 'ui';
import { useGoal } from 'hooks/useGoal';
import { useUser } from 'hooks/useUserState';

export function TeamLeadersTabs() {
  const [activeTab, setActiveTab] = useState<string>('1');
  const hookGoal = useGoal();
  const { user } = useUser();
  const tabItems = [
    {
      key: '1',
      label: t('kpi_establishment'),
      children: (
        <div>
          <TeamLeadersFilter month={false} />
          {user?.role == 'TeamLeaders' && <TeamLeadersList users={hookGoal?.teamLeaders?.data} />}
          <TeamLeadersList users={hookGoal?.teamMeambers?.data} />
        </div>
      ),
    },
    {
      key: '2',
      label: t('kpi_performance'),
      children: (
        <div>
          <TeamLeadersFilter month={true} />
          <ProcessList users={hookGoal?.teamMeambers?.data} />
          {user?.role == 'TeamLeaders' && <ProcessList users={undefined} />}
        </div>
      ),
    },
  ];

  return <Tabs animated={true} type="line" activeKey={activeTab} onChange={setActiveTab} items={tabItems} />;
}
