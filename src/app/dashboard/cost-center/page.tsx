'use client';

import React from 'react';
import DataTable from './AnyDataTable';
import { useQuery } from '@tanstack/react-query';
import { fetchCostCenter } from '@/lib/data';

const CostCenterPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["costCenter"],
    queryFn: fetchCostCenter
  })

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Cost Center</h1>
      <DataTable data={data!} />
    </div>
  );
};

export default CostCenterPage;