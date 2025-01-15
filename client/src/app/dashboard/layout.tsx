import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <div className="w-full h-full flex flex-col px-4">{children} </div>
      </SidebarInset>
    </SidebarProvider>
    </>
  );
} 