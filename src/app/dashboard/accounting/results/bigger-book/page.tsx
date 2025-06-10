"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbDashboard } from "@/features/accounting/shared/components/BreadcrumDash";
import { AccountSection } from "@/features/accounting/bigger-book/components/AccountSection";

// Main Component
export default function BiggerBookPage() {
  const currentPath = usePathname();

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* <ReportSection /> */}

      <BreadcrumbDashboard
        items={[
          {
            label: "Panel",
            href: "/dashboard/accounting",
          },
          {
            label: "Reportes",
            href: "#",
          },
          {
            label: "Libro Mayor",
            href: "/dashboard/accounting/results/bigger-book",
          },
        ]}
      />

      <AccountSection />
    </div>
  );
}
