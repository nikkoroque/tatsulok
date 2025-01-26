import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { ReactNode } from "react";
import StoreProvider from "@/app/redux";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
    <StoreProvider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <div className="w-full h-full flex flex-col px-4">{children} </div>
      </SidebarInset>
    </SidebarProvider>
    </StoreProvider>
    </>
  );
} 