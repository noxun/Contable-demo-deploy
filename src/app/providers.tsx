"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NuqsAdapter>{children}</NuqsAdapter>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
