"use client";
import Link from "next/link";
import React, { Fragment } from "react";
import { User} from "lucide-react";
import { MENU_OPTIONS } from "../constants/menu-options";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export const SideMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name;

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/auth/login');
  };



  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {MENU_OPTIONS.map((option, index) => (
        <Fragment key={index}>
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
        </Fragment>
      ))}

<div className="flex flex-col items-center mt-4">
        <User className="text-4xl text-muted-foreground" />
        <span className="mt-2 text-sm">{userName}</span>
        <button onClick={logout} className="mt-2 text-sm text-primary hover:underline">
          Cerrar Sesión
        </button>
      </div>
      
    </nav>
  );
};
