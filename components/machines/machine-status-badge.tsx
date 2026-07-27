import { Badge } from "@/components/ui/badge";
import {
  MachineStatus,
  MACHINE_STATUS_LABELS,
  type MachineStatusType,
} from "@/constants/machine-status";

interface MachineStatusBadgeProps {
  status?: string | null;
}

export function MachineStatusBadge({ status }: MachineStatusBadgeProps) {
  if (!status) {
    return <Badge variant="outline">Unspecified</Badge>;
  }

  const normalized = status.toUpperCase();

  switch (normalized) {
    case MachineStatus.OPERATIONAL:
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200">
          {MACHINE_STATUS_LABELS[MachineStatus.OPERATIONAL]}
        </Badge>
      );
    case MachineStatus.UNDER_REPAIR:
      return (
        <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200">
          {MACHINE_STATUS_LABELS[MachineStatus.UNDER_REPAIR]}
        </Badge>
      );
    case MachineStatus.MAINTENANCE:
      return (
        <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200">
          {MACHINE_STATUS_LABELS[MachineStatus.MAINTENANCE]}
        </Badge>
      );
    case MachineStatus.INACTIVE:
      return (
        <Badge className="bg-zinc-500/15 text-zinc-700 hover:bg-zinc-500/25 dark:bg-zinc-500/20 dark:text-zinc-400 border-zinc-200">
          {MACHINE_STATUS_LABELS[MachineStatus.INACTIVE]}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
