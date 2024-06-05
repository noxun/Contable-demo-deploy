"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { LogOut, User, ChevronDown, ChevronRight } from "lucide-react";
import { MENU_OPTIONS } from "../constants/menu-options";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const SideMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState<number[]>([]);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(user.name ?? "");

    // Iniciar todos los submenús abiertos por defecto
    setOpenSubMenu(MENU_OPTIONS.map((_, index) => index));
  }, []);

  const toggleSubMenu = (index: number) => {
    setOpenSubMenu((prevOpenSubMenu) =>
      prevOpenSubMenu.includes(index)
        ? prevOpenSubMenu.filter((i) => i !== index)
        : [...prevOpenSubMenu, index]
    );
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col justify-between h-screen">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {MENU_OPTIONS.map((option, index) => (
          <Fragment key={index}>
            <div
              className="flex items-center justify-between cursor-pointer px-3 py-2"
              onClick={() => toggleSubMenu(index)}
            >
              <span>{option.name}</span>
              {openSubMenu.includes(index) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
            {openSubMenu.includes(index) && (
              <div className="pl-4">
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
              </div>
            )}
            {index < MENU_OPTIONS.length - 1 && <Separator className="my-2" />}
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
      </div>
    </div>
  );
};