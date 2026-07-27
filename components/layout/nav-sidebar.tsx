"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Calendar,
  Package,
  Users,
  Settings,
} from "lucide-react";

interface NavSidebarProps {
  onNavClick?: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Machines (Thiết bị)", href: ROUTES.MACHINES.LIST, icon: Wrench },
  { label: "Repair Tickets", href: ROUTES.TICKETS.LIST, icon: FileText },
  { label: "Schedules", href: ROUTES.SCHEDULES.LIST, icon: Calendar },
  { label: "Tools & Parts", href: ROUTES.TOOLS.LIST, icon: Package },
  { label: "User Management", href: ROUTES.USERS.LIST, icon: Users },
];

export function NavSidebar({ onNavClick }: NavSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <Wrench className="h-6 w-6" />
          <span>MAINTENANCE-DDC</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer / Profile Link */}
      <div className="p-4 border-t">
        <Link
          href={ROUTES.PROFILE}
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted"
        >
          <Settings className="h-4 w-4" />
          <span>Profile Settings</span>
        </Link>
      </div>
    </div>
  );
}
