import { t } from 'i18next';
import React, { useState } from 'react';
import { TeamLeadersFilter } from './TeamLeadersFilter';
import { TeamLeadersList } from './TeamLeadersList';
import { ProcessList } from './ProcessKPI/ProcessList';
import { Tabs } from 'ui';

export function TeamLeadersTabs() {
  const [activeTab, setActiveTab] = useState<string>('1');

  const tabItems = [
    {
      key: '1',
      label: t('kpi_establishment'),
      children: (
        <div>
          <TeamLeadersFilter month={false} />
          <TeamLeadersList users={undefined} />
          <ProcessList users={undefined} />
        </div>
      ),
    },
    {
      key: '2',
      label: t('kpi_performance'),
      children: (
        <div>
          <TeamLeadersFilter month={true} />
          <ProcessList users={undefined} />
          <TeamLeadersList users={undefined} />
        </div>
      ),
    },
  ];

  return <Tabs animated={true} type="line" activeKey={activeTab} onChange={setActiveTab} items={tabItems} />;
}
