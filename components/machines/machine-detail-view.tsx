import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { MachineStatusBadge } from "./machine-status-badge";
import {
  ArrowLeft,
  Edit,
  Wrench,
  Building2,
  Users,
  Calendar,
  Hash,
  FileText,
  Clock,
} from "lucide-react";
import type { MachineDetail } from "@/types/machine.types";

interface MachineDetailViewProps {
  machine: MachineDetail;
  canEdit?: boolean;
}

export function MachineDetailView({ machine, canEdit }: MachineDetailViewProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/machines"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground uppercase">
                {machine.machineCode}
              </span>
              <MachineStatusBadge status={machine.currentStatus} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {machine.machineName}
            </h1>
          </div>
        </div>

        {canEdit && (
          <Link
            href={`/machines/${machine.id}/edit`}
            className={buttonVariants({ variant: "default" })}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Machine
          </Link>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Location & Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Workshop (Xưởng)</span>
              <span className="font-medium">{machine.workshopName || "—"}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Team (Tổ)</span>
              <span className="font-medium flex items-center gap-1.5 mt-0.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {machine.teamName || "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" /> Maintenance Specification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Maintenance Cycle</span>
              <span className="font-medium text-base">
                Every {machine.maintenanceCycle.value}{" "}
                <span className="lowercase">{machine.maintenanceCycle.type}</span>(s)
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Current Status</span>
              <div className="mt-1">
                <MachineStatusBadge status={machine.currentStatus} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" /> Identification & Hardware Info
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Serial Number</span>
              <span className="font-mono">{machine.serialNumber || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Manufacturer</span>
              <span>{machine.manufacturer || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Model</span>
              <span>{machine.model || "N/A"}</span>
            </div>
            {machine.installDate && (
              <div>
                <span className="text-xs text-muted-foreground block flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Installation Date
                </span>
                <span>{new Date(machine.installDate).toLocaleDateString()}</span>
              </div>
            )}
            <div>
              <span className="text-xs text-muted-foreground block flex items-center gap-1">
                <Clock className="h-3 w-3" /> Created
              </span>
              <span>{new Date(machine.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {machine.note && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Notes & Remarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {machine.note}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
