import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MachineStatusBadge } from "./machine-status-badge";
import { Eye, Edit, Wrench, Calendar } from "lucide-react";
import type { MachineListItem } from "@/types/machine.types";

interface MachineCardProps {
  machine: MachineListItem;
  canEdit?: boolean;
  onDelete?: (id: string) => void;
}

export function MachineCard({ machine, canEdit }: MachineCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {machine.machineCode}
            </span>
            <CardTitle className="text-base font-semibold line-clamp-1">
              {machine.machineName}
            </CardTitle>
          </div>
          <MachineStatusBadge status={machine.currentStatus} />
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1.5 text-muted-foreground pb-4">
        {machine.serialNumber && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground text-xs">S/N:</span>
            <span className="text-xs font-mono">{machine.serialNumber}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs">
          <Wrench className="h-3.5 w-3.5" />
          <span>
            Cycle: {machine.maintenanceCycle.value} {machine.maintenanceCycle.type.toLowerCase()}
          </span>
        </div>
        {machine.model && (
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>Model: {machine.model}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-end gap-2">
        <Link
          href={`/machines/${machine.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> View
        </Link>
        {canEdit && (
          <Link
            href={`/machines/${machine.id}/edit`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
