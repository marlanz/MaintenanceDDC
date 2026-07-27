import Link from "next/link";
import { Wrench, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface MachineEmptyStateProps {
  canCreate?: boolean;
}

export function MachineEmptyState({ canCreate }: MachineEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card/50 my-4 min-h-[250px]">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Wrench className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No machines found</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        No machines match your query. Try resetting your search filters or add a new machine to the system.
      </p>
      {canCreate && (
        <Link href="/machines/new" className={buttonVariants({ size: "sm" })}>
          <Plus className="h-4 w-4 mr-1.5" /> Add New Machine
        </Link>
      )}
    </div>
  );
}
