"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
