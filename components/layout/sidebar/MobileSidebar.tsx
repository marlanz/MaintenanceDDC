"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { UserRoleType } from "@/constants/roles";

interface MobileSidebarProps {
  role?: UserRoleType | null;
}

export function MobileSidebar({ role }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            />
          }
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mở menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 h-full border-none">
          <SheetTitle className="sr-only">Menu Điều Hướng</SheetTitle>
          <Sidebar role={role} onNavClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
