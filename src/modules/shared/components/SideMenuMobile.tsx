"use client";
import Link from "next/link";
import { Archive } from "lucide-react";
import { MENU_OPTIONS } from "../constants/menu-options";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

const SideMenuMobile = () => {
  const pathname = usePathname();
  return (
    <nav className="grid gap-2 text-lg font-medium">
      <div className="flex justify-between mr-2">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Archive className="h-6 w-6" />
          <span>Noxun</span>
        </Link>
        <ModeToggle />
      </div>
      {MENU_OPTIONS.map((option) =>
        option.routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl ${
              pathname === route.path
                ? "bg-muted px-3 py-2 text-foreground"
                : "px-3 py-2 text-muted-foreground"
            }  hover:text-foreground`}
          >
            {route.icon}
            {route.name}
          </Link>
        ))
      )}
    </nav>
  );
};

export default SideMenuMobile;
