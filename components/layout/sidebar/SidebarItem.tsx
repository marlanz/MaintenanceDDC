"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem } from "@/constants/navigation";

interface SidebarItemProps {
  item: NavigationItem;
  onNavClick?: () => void;
}

export function SidebarItem({ item, onNavClick }: SidebarItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  // Check if any child route is currently active
  const hasActiveChild = React.useMemo(() => {
    if (!item.children) return false;
    return item.children.some((child) => {
      // Direct match or start of a nested child route
      return pathname === child.href || pathname.startsWith(`${child.href}/`);
    });
  }, [item.children, pathname]);

  // Expand parent if a child route is active or if user manually opened it
  const [isOpen, setIsOpen] = useState(hasActiveChild);
  const [prevHasActiveChild, setPrevHasActiveChild] = useState(hasActiveChild);

  if (hasActiveChild !== prevHasActiveChild) {
    setPrevHasActiveChild(hasActiveChild);
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }

  // Check if the parent link is active
  const isParentActive = React.useMemo(() => {
    // If it has children, parent is active if a child is active
    if (item.children) return hasActiveChild;
    // Otherwise, direct match or starts with parent href (if not home page)
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }, [item.href, item.children, pathname, hasActiveChild]);

  const handleParentClick = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (onNavClick) {
      onNavClick();
    }
  };

  const itemClasses = cn(
    "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-primary/20",
    isParentActive
      ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25 scale-[1.02]"
      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01]"
  );

  return (
    <div className="space-y-1">
      {item.children ? (
        <button
          onClick={handleParentClick}
          aria-expanded={isOpen}
          aria-controls={`submenu-${item.title.toLowerCase()}`}
          className={itemClasses}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </button>
      ) : (
        <Link href={item.href} onClick={handleParentClick} className={itemClasses}>
          <div className="flex items-center gap-3">
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span>{item.title}</span>
          </div>
        </Link>
      )}

      {/* Submenu Children list */}
      {item.children && (
        <div
          id={`submenu-${item.title.toLowerCase()}`}
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out pl-9 border-l border-sidebar-border ml-6 space-y-1",
            isOpen ? "max-h-96 opacity-100 py-1" : "max-h-0 opacity-0 pointer-events-none"
          )}
        >
          {item.children.map((child) => {
            const isChildActive =
              pathname === child.href || pathname.startsWith(`${child.href}/`);

            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavClick}
                className={cn(
                  "flex items-center py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200",
                  isChildActive
                    ? "text-primary font-bold bg-primary/5 scale-[1.01]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5"
                )}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
