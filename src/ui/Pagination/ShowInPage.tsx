import { Select } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StyledPagination } from './style';

interface ShowInPageProps {
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
}
const ShowInPage: React.FC<ShowInPageProps> = ({ pageSize = 10, onPageSizeChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const queryPageSize = queryParams.get('pageSize');

  const handlePageSizeChange = (value: number) => {
    queryParams.set('pageIndex', '1');
    queryParams.set('pageSize', value.toString());
    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
    onPageSizeChange?.(value);
  };

  return (
    <StyledPagination>
      <div className="pagination-page-size">
        <span className="show-in-page">Show in page</span>
        <Select
          value={parseInt(queryPageSize || pageSize.toString(), 10)}
          onChange={handlePageSizeChange}
          options={[10, 20, 30, 50].map((size) => ({ value: size, label: size }))}
        />
      </div>
    </StyledPagination>
  );
};

export default ShowInPage;
