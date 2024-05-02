// import { verifyToken } from "@/modules/auth";
// import "@/modules/shared/styles.css";
import { SideMenu } from "@/modules/shared/components/SideMenu";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const token = await verifyToken();

  //   if (!token) redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      <SideMenu />
      <main className="dashboard__main">{children}</main>
    </div>
  );
}
