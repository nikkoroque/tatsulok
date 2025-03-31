import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import StoreProvider from "@/app/redux";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <AuthProvider>
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="w-full h-full flex flex-col px-4">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      </AuthProvider>
    </StoreProvider>
  );
}