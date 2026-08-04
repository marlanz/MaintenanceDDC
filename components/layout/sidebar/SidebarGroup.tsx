"use client";

import React from "react";
import { NavigationItem } from "@/constants/navigation";
import { SidebarItem } from "./SidebarItem";

interface SidebarGroupProps {
  title?: string;
  items: NavigationItem[];
  onNavClick?: () => void;
}

export function SidebarGroup({ title, items, onNavClick }: SidebarGroupProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {title && (
        <h3 className="px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
          {title}
        </h3>
      )}
      <div className="space-y-1.5">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            onNavClick={onNavClick}
          />
        ))}
      </div>
    </div>
  );
}
