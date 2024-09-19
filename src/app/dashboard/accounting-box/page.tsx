'use client';

import React from 'react';
import DataTable from './AnyDataTable';
import { useQuery } from '@tanstack/react-query';
import { fetchAccountingBox } from '@/lib/data';

const AccountingBoxPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accounting"],
    queryFn: fetchAccountingBox
  })

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Accounting Box</h1>
      <DataTable data={data!} />
    </div>
  );
};

export default AccountingBoxPage;