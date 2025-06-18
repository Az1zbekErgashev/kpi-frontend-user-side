import React from 'react';
import { StyledTeamLeadersPage } from './style';
import { TeamLeadersFilter, TeamLeadersList, TeamLeadersTabs } from 'components';
import Pagination from 'ui/Pagination/Pagination';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export function TeamLeaders() {
  const { t } = useTranslation();
  return (
    <StyledTeamLeadersPage>
      <div className="styled_header">
        <h1 className="title">{t('please_set_personal_kpi')}</h1>
      </div>
      <TeamLeadersTabs />
    </StyledTeamLeadersPage>
  );
}
