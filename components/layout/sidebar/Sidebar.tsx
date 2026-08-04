"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Settings, LogOut, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildNavigation } from "@/lib/auth/navigation";
import { UserRoleType } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { SidebarGroup } from "./SidebarGroup";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  role?: UserRoleType | null;
  onNavClick?: () => void;
}

export function Sidebar({ role, onNavClick }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const navigationItems = buildNavigation(role);

  // Filter items into logical groups
  const generalItems = navigationItems.filter(
    (item) => item.title !== "User Management"
  );
  const adminItems = navigationItems.filter(
    (item) => item.title === "User Management"
  );

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isProfileActive = pathname === ROUTES.PROFILE;

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border backdrop-blur-md bg-sidebar/95 sticky top-0 z-10">
        <Link 
          href={ROUTES.DASHBOARD}
          onClick={onNavClick}
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="h-9 w-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand shadow-sm shadow-brand/15">
            <Wrench className="h-[18px] w-[18px] stroke-[2.5]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm tracking-wide text-foreground uppercase">
              DDC Maintenance
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Portal Hệ Thống
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Items (Scrollable) */}
      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto scrollbar-thin">
        {/* General Operations Group */}
        <SidebarGroup
          title="Hành chính & Vận hành"
          items={generalItems}
          onNavClick={onNavClick}
        />

        {/* Administration Group */}
        <SidebarGroup
          title="Quản trị"
          items={adminItems}
          onNavClick={onNavClick}
        />
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar/50 space-y-1">
        {/* Profile Settings */}
        <Link
          href={ROUTES.PROFILE}
          onClick={onNavClick}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
            isProfileActive
              ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01]"
          )}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          <span>Thông tin tài khoản</span>
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-[1.01] focus:outline-none"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
