"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { LogOut, User, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/userStore";
import { useQuery } from "@tanstack/react-query";
import { fetchAllRoles, fetchUserRoles } from "@/lib/data";
import { getIconComponent } from "../utils/getIconComponent";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubItem, SidebarProvider } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Image from "next/image";
import { APP_LOGO_URL } from "@/lib/constants";

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
    return <div></div>;
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-2">
            <Link href="#" className="flex items-center gap-2 font-semibold mb-4">
              <Image className="h-8 w-full" src={APP_LOGO_URL} width={3840} height={1040} alt="Logo" />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allRoles.map((category, index) => (
                <Fragment key={index}>
                  {category?.rolsList?.some((role) => userHasAccess(role.name)) && (
                    <Collapsible
                      // defaultOpen
                      open={openSubMenu.includes(index)}
                      onOpenChange={() => toggleSubMenu(index)}
                      className="relative"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <span className="flex items-center justify-between w-full">
                              {category.name}
                              {openSubMenu.includes(index) ? (
                                <ChevronDown className="ml-auto h-4 w-4" />
                              ) : (
                                <ChevronRight className="ml-auto h-4 w-4" />
                              )}
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {category.rolsList.map(
                              (role) =>
                                userHasAccess(role.name) && (
                                  <SidebarMenuSubItem key={role.name}>
                                    <Link
                                      href={`/dashboard/accounting/${role.name}`}
                                      className={`px-1 pt-1 flex items-center gap-2 ${pathname === `/dashboard/accounting/${role.name}`
                                        ? "text-primary font-semibold"
                                        : "text-muted-foreground"
                                        }`}
                                    >
                                      {role.icon && getIconComponent(role.icon)}
                                      {role?.title![0]?.toUpperCase() + role.title?.slice(1)}
                                    </Link>
                                  </SidebarMenuSubItem>
                                )
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                      <hr className="absolute -bottom-1 z-20 w-full h-[1.2px] bg-gradient-to-r from-black/20 to-transparent" />
                    </Collapsible>
                  )}
                </Fragment>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex flex-col items-center gap-2 pt-5 pb-4">
          <User className="text-4xl text-muted-foreground" />
          <span className="text-sm">{userName}</span>
          <Button variant="link" onClick={logout}>
            <span className="mr-2">Cerrar Sesión</span>
            <LogOut size={18} />
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
