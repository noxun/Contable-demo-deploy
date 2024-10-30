"use client";
import Link from "next/link";
import React, { useEffect, useState, Fragment } from "react";
import { Archive, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAllRoles, fetchUserRoles } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import useUserStore from "@/lib/userStore";
import { getIconComponent } from "../utils/getIconComponent";

const SideMenuMobile = () => {
  const pathname = usePathname();
  const getLoginData = useUserStore(state => state.getLoginData);
  const loginData = getLoginData();
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

  if (isPendingAllRoles || isPendingUserRoles || userRoles === undefined || allRoles === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="grid gap-2 text-lg font-medium">
      <div className="flex justify-between mr-2">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
          <Archive className="h-6 w-6" />
          <span>Noxun</span>
        </Link>
        <ModeToggle />
      </div>
      {allRoles.map((category, index) => (
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
                              ? "bg-muted px-3 py-2 text-foreground"
                              : "px-3 py-2 text-muted-foreground"
                          } transition-all hover:text-foreground`}
                        >
                          {role.icon ? getIconComponent(role.icon) : null}
                          {role?.title![0].toUpperCase() + role?.title!.slice(1)}
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
  );
};

export default SideMenuMobile;
