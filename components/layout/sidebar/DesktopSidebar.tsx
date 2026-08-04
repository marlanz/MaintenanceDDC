"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { UserRoleType } from "@/constants/roles";

interface DesktopSidebarProps {
  role?: UserRoleType | null;
}

export function DesktopSidebar({ role }: DesktopSidebarProps) {
  return (
    <aside className="hidden md:block w-64 shrink-0 h-full">
      <Sidebar role={role} />
    </aside>
  );
}
