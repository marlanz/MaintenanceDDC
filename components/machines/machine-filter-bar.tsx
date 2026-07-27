"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ALL_MACHINE_STATUSES,
  MACHINE_STATUS_LABELS,
} from "@/constants/machine-status";
import { FilterX } from "lucide-react";

interface FilterOption {
  id: string;
  name: string;
}

interface MachineFilterBarProps {
  workshops?: FilterOption[];
  teams?: FilterOption[];
}

export function MachineFilterBar({ workshops = [], teams = [] }: MachineFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentWorkshop = searchParams.get("workshopId") || "ALL";
  const currentTeam = searchParams.get("teamId") || "ALL";
  const currentStatus = searchParams.get("status") || "ALL";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
      params.set("page", "1");
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters =
    searchParams.has("workshopId") ||
    searchParams.has("teamId") ||
    searchParams.has("status") ||
    searchParams.has("query");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {workshops.length > 0 && (
        <Select
          value={currentWorkshop}
          onValueChange={(val) => val !== null && updateParam("workshopId", val)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Workshops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Workshops</SelectItem>
            {workshops.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {teams.length > 0 && (
        <Select
          value={currentTeam}
          onValueChange={(val) => val !== null && updateParam("teamId", val)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Teams</SelectItem>
            {teams.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={currentStatus}
        onValueChange={(val) => val !== null && updateParam("status", val)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {ALL_MACHINE_STATUSES.map((statusKey) => (
            <SelectItem key={statusKey} value={statusKey}>
              {MACHINE_STATUS_LABELS[statusKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="text-xs flex items-center gap-1"
        >
          <FilterX className="h-3.5 w-3.5" /> Clear Filters
        </Button>
      )}
    </div>
  );
}
