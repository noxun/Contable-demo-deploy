"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SideMenu } from "@/features/accounting/shared/components/SideMenu";
import { Bolt } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import UfvRegistrationDialog from "@/features/accounting/ufv/components/UfvRegistrationDialog";
import { useInitializeUserStore } from "@/features/accounting/shared/hooks/useInitializeUserStore";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  useInitializeUserStore();

  return (
    <SidebarProvider>
      <SideMenu />
      <main className="w-full flex flex-col gap-2 max-w-full overflow-hidden">
        <div className="w-full px-4 py-1 sticky top-0 z-50 bg-sidebar flex items-center justify-between max-w-full">
          <SidebarTrigger className="size-10 p-[10px] text-black dark:text-white bg-white dark:bg-black border-[1px] border-black/10 dark:border-white/10" />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button asChild variant="outline" size="icon">
              <Link className="sm:ml-auto" href="/dashboard/accounting/config">
                <Bolt className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 min-h-screen">{children}</div>
      </main>
      <UfvRegistrationDialog />
    </SidebarProvider>
  );
}
