"use client";

import React from "react";
import { CostCenter } from "@/lib/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import BiggerBookByAccountCodeDialog from "@/features/accounting/bigger-book/components/BiggerBookByAccountCodeDialog";

export default function ListCostCenter({
  costCenter,
}: {
  costCenter: (CostCenter | null)[];
}) {
  return (
    <div className="w-full space-y-2">
      {costCenter.map((center, index) => (
        <Collapsible key={index} className="border rounded-md overflow-hidden">
          <div className="flex w-full">
            <CollapsibleTrigger className="flex items-center px-4 py-2 bg-gray-50 w-full text-left">
              <div className="flex items-center w-full">
                <ChevronDown className="h-4 w-4 mr-2 transition-transform ui-open:rotate-180" />
                <span className="font-medium mr-3">{center?.code}</span>
                <span>{center?.name}</span>
              </div>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="px-4 py-2 bg-white">
              <p className="text-sm text-gray-500 mb-3">{center?.descripcion}</p>

              <div className="space-y-2">
                {(Array.isArray(center?.accountItems)
                  ? center.accountItems
                  : []
                ).map((item, index) => (
                  <div
                    key={index}
                    className="pl-6 py-1 border-l-2 border-gray-200"
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-sm w-24">
                        {item.code}
                      </span>
                      <span className="text-sm flex-1">{item.description}</span>
                      <BiggerBookByAccountCodeDialog accountCode={item.code} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
