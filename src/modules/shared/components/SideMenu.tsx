"use client";
import Link from "next/link";
import React from "react";
import { MENU_OPTIONS } from "../constants/menu-options";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export const SideMenu = () => {
  const pathname = usePathname();
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {MENU_OPTIONS.map((option, index) => (
        <>
          {option.routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`flex items-center gap-3 rounded-lg ${
                pathname === route.path
                  ? "bg-muted px-3 py-2 text-primary"
                  : "px-3 py-2 text-muted-foreground"
              } transition-all hover:text-primary`}
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
          {index < MENU_OPTIONS.length - 1 ? (
            <Separator className="my-2" />
          ) : null}
        </>
      ))}
    </nav>
  );
};
