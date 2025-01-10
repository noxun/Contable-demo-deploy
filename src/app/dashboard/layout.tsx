"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SideMenu } from "@/modules/shared/components/SideMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideMenuMobile from "@/modules/shared/components/SideMenuMobile";
import { Archive, Bolt, Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import UfvRegistrationDialog from "@/modules/ufv/components/UfvRegistrationDialog";
import { useInitializeUserStore } from "@/modules/shared/hooks/useInitializeUserStore";
import Image from "next/image";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  useInitializeUserStore();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]  ">
      <div className="hidden border-r bg-muted/40 md:block border-gray-700">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 justify-between lg:h-[60px] lg:px-6 border-gray-500">
            <Link href="#" className="flex items-center gap-2 font-semibold">
              {/* <Archive className="h-6 w-6" />
              <span className="">Noxun</span> */}
              <Image className="h-8 w-full" src="/images/tradecruz_logo.png" width={3840} height={1040} alt="Logo" />
            </Link>
            <ModeToggle />
          </div>
          <div className="flex-1 overflow-y-auto">
            <SideMenu />
          </div>
        </div>
      </div>
      <div className="flex flex-col ">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 border-gray-500">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col overflow-y-auto">
              <SideMenuMobile />
            </SheetContent>
          </Sheet>
          <Button asChild variant="outline" size="icon">
            <Link className="sm:ml-auto" href="/dashboard/config">
              <Bolt className="size-4" />
            </Link>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
      <UfvRegistrationDialog />
    </div>
  );
}
