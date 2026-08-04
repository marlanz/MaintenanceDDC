import { redirect } from "next/navigation";
import {
  getCurrentUser,
  sessionExistsButNoProfile,
} from "@/lib/auth/get-current-user";
import { NavHeader } from "@/components/layout/nav-header";
import { DesktopSidebar } from "@/components/layout/sidebar/DesktopSidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    // Check: is there a session but just no profile yet?
    const needsProfile = await sessionExistsButNoProfile();
    if (needsProfile) {
      redirect("/first-login");
    }
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar role={user.role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <NavHeader user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
