import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { MachineStatusBadge } from "./machine-status-badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { MachineListItem } from "@/types/machine.types";

interface MachineTableProps {
  machines: MachineListItem[];
  canEdit?: boolean;
  canDelete?: boolean;
  onDeleteClick?: (machine: MachineListItem) => void;
}

export function MachineTable({
  machines,
  canEdit,
  canDelete,
  onDeleteClick,
}: MachineTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Code</TableHead>
            <TableHead>Machine Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Maintenance Cycle</TableHead>
            <TableHead>Model / S/N</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {machines.map((machine) => (
            <TableRow key={machine.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-xs font-semibold">
                {machine.machineCode}
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/machines/${machine.id}`}
                  className="hover:underline text-primary"
                >
                  {machine.machineName}
                </Link>
              </TableCell>
              <TableCell>
                <MachineStatusBadge status={machine.currentStatus} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                Every {machine.maintenanceCycle.value}{" "}
                {machine.maintenanceCycle.type.toLowerCase()}(s)
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {machine.model || "—"}{" "}
                {machine.serialNumber ? `(${machine.serialNumber})` : ""}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/machines/${machine.id}`}
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  {canEdit && (
                    <Link
                      href={`/machines/${machine.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "icon" })}
                      title="Edit Machine"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  )}
                  {canDelete && onDeleteClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteClick(machine)}
                      title="Delete Machine"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
