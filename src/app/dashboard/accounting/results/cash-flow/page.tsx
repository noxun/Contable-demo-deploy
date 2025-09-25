"use client";

import { BreadcrumbDashboard } from "@/features/accounting/shared/components/BreadcrumDash";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DownloadTemplatesButton } from "@/features/accounting/cash-flow/components/download-templates";

import { UploadFinancialFilesDialog } from "@/features/accounting/cash-flow/components/UploadFinancialFilesDialog";
import { DialogWorkSheet } from "@/features/accounting/cash-flow/components/DialogWorkSheet";
import { WorkSheetPreview } from "@/features/accounting/cash-flow/components/WorkSheetPreview";
import { IndirectCashFlowPreview } from "@/features/accounting/cash-flow/components/IndirectCashFlowPreview";

export default function ClashFlowPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
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
            label: "Flujo de efectivo",
            href: "/dashboard/accounting/results/cash-flow",
          },
        ]}
      />

      <div className="flex items-center gap-4">
        <DownloadTemplatesButton />
        <DialogWorkSheet />
        <UploadFinancialFilesDialog />
      </div>
      {/* HOJA DE TRABAJO */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="worksheet">
          <AccordionTrigger>Hoja de Trabajo</AccordionTrigger>
          <AccordionContent>
            <WorkSheetPreview />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <IndirectCashFlowPreview />
    </div>
  );
}
