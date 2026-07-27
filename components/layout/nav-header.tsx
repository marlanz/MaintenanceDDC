"use client";

import { useState } from "react";
import { Menu, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NavSidebar } from "./nav-sidebar";
import type { CurrentAuthUser } from "@/types/auth.types";

interface NavHeaderProps {
  user?: CurrentAuthUser | null;
}

export function NavHeader({ user }: NavHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left: Mobile Sheet Trigger + Page Title */}
      <div className="flex items-center gap-3">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <NavSidebar onNavClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 font-semibold text-lg md:hidden">
          <Wrench className="h-5 w-5 text-primary" />
          <span>DDC Maintenance</span>
        </div>
      </div>

      {/* Right: User Info & Role Badge */}
      {user && (
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium leading-none">
              {user.name}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              {user.role}
            </div>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
