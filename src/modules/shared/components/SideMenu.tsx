"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { LogOut, User, ChevronDown, ChevronRight } from "lucide-react";
import { MENU_OPTIONS } from "../constants/menu-options";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/userStore";
import { useQuery } from "@tanstack/react-query";
import { fetchAllRoles, fetchUserRoles } from "@/lib/data";
import { getIconComponent } from "../utils/getIconComponent";

export const SideMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const getLoginData = useUserStore((state) => state.getLoginData);
  const loginData = getLoginData();
  const userName = loginData?.user.name;
  const userId = loginData?.user.id;

  const { data: allRoles, isPending: isPendingAllRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: fetchAllRoles,
  });
  const { data: userRoles, isPending: isPendingUserRoles } = useQuery({
    queryKey: ["userRoles", userId],
    queryFn: () => fetchUserRoles(userId!),
    enabled: !!userId,
  });

  const [openSubMenu, setOpenSubMenu] = useState<number[]>([]);

  useEffect(() => {
    if (allRoles) {
      setOpenSubMenu(allRoles.map((_, index) => index));
    }
  }, [allRoles]);

  //console.log(userRoles, allRoles)

  if (
    isPendingAllRoles ||
    isPendingUserRoles ||
    userRoles === undefined ||
    allRoles === undefined
  ) {
    return <div>Loading...</div>;
  }

  const toggleSubMenu = (index: number) => {
    setOpenSubMenu((prevOpenSubMenu) =>
      prevOpenSubMenu.includes(index)
        ? prevOpenSubMenu.filter((i) => i !== index)
        : [...prevOpenSubMenu, index]
    );
  };
  const userHasAccess = (roleName: string) => {
    return userRoles?.some((role) => role.name === roleName);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loginResponse");
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col justify-between h-screen">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {allRoles?.map((category, index) => (
          <Fragment key={index}>
            {category?.rolsList?.some((role) => userHasAccess(role.name)) && (
              <>
                <div
                  className="flex items-center justify-between cursor-pointer px-3 py-2"
                  onClick={() => toggleSubMenu(index)}
                >
                  <span>{category.name}</span>
                  {openSubMenu.includes(index) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
                {openSubMenu.includes(index) && (
                  <div className="pl-4">
                    {category?.rolsList?.map(
                      (role) =>
                        userHasAccess(role.name) && (
                          <Link
                            key={role.name}
                            href={`/dashboard/${role.name}`}
                            className={`flex items-center gap-3 rounded-lg ${
                              pathname === `/dashboard/${role.name}`
                                ? "bg-muted px-3 py-2 text-primary"
                                : "px-3 py-2 text-muted-foreground"
                            } transition-all hover:text-primary`}
                          >
                            {role.icon ? getIconComponent(role.icon) : null}
                            {role?.title![0]?.toUpperCase() +
                              role.title?.slice(1)}
                          </Link>
                        )
                    )}
                  </div>
                )}
              </>
            )}
            {index < allRoles.length - 1 && <Separator className="my-2" />}
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
