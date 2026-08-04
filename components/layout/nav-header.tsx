"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { authClient } from "@/lib/auth-client";
import type { CurrentAuthUser } from "@/types/auth.types";
import { USER_ROLE_VN_LABELS } from "@/constants";

interface NavHeaderProps {
  user?: CurrentAuthUser | null;
}

export function NavHeader({ user }: NavHeaderProps) {
  const router = useRouter();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left: Mobile Sidebar Trigger + Page Title */}
      <div className="flex items-center gap-2 md:hidden">
        {user && <MobileSidebar role={user.role} />}

        <div className="flex items-center gap-2 font-semibold text-[16px] md:hidden">
          <span>Hệ thống Bảo trì MMTB DDC</span>
        </div>
      </div>

      {/* Right: User Info & Role Badge */}
      {user && (
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium leading-none">
              <span className="font-bold">{user.fullName}</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1 font-semibold">
              {USER_ROLE_VN_LABELS[user.role]} - Mã NV: {user.employeeCode}
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {/* <Button
            onClick={async () => {
              await authClient.signOut();
              router.push("/login");
            }}
          >
            logout
          </Button> */}
        </div>
      )}
    </header>
  );
}
