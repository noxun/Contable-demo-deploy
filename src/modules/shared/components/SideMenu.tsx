"use client";
import Link from "next/link";
import React, { Fragment } from "react";
import { LogOut, User } from "lucide-react";
import { MENU_OPTIONS } from "../constants/menu-options";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const SideMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col justify-between h-full">
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
      </nav>
      <div className="flex flex-col items-center">
        <User className="text-4xl text-muted-foreground" />
        <span className="mt-2 text-sm">{userName}</span>
        <Button variant="link" onClick={logout}>
          <span className="mr-2">Cerrar Sesión</span>
          <LogOut size={18} />
        </Button>

        {/* <button
          onClick={toUsers}
          className="mt-2 text-large text-primary-500 hover:underline"
        >
          Usuarios
        </button> */}
        
      </div>
    </div>
  );
};
