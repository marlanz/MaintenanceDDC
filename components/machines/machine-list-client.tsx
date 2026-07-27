"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { MachineTable } from "./machine-table";
import { MachineCard } from "./machine-card";
import { MachineEmptyState } from "./machine-empty-state";
import { MachineDeleteDialog } from "./machine-delete-dialog";
import { deleteMachineAction } from "@/app/actions/machine/delete-machine.action";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import type { MachineListItem } from "@/types/machine.types";
import type { PaginatedResult } from "@/types/pagination.types";

interface MachineListClientProps {
  paginatedResult: PaginatedResult<MachineListItem>;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function MachineListClient({
  paginatedResult,
  canCreate,
  canEdit,
  canDelete,
}: MachineListClientProps) {
  const router = useRouter();
  const [selectedMachine, setSelectedMachine] = useState<MachineListItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: machines, pagination } = paginatedResult;

  const handleDeleteClick = (machine: MachineListItem) => {
    setSelectedMachine(machine);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    const res = await deleteMachineAction(id);
    if (res.success) {
      toast.success("Machine deleted successfully");
      router.refresh();
    } else {
      toast.error(res.error.message);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Machines List
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Total {pagination.total} machine(s) found
          </p>
        </div>

        {canCreate && (
          <Link href="/machines/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Machine
          </Link>
        )}
      </div>

      {/* Main List Rendering */}
      {machines.length === 0 ? (
        <MachineEmptyState canCreate={canCreate} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <MachineTable
              machines={machines}
              canEdit={canEdit}
              canDelete={canDelete}
              onDeleteClick={handleDeleteClick}
            />
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {machines.map((machine: MachineListItem) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                canEdit={canEdit}
                onDelete={canDelete ? () => handleDeleteClick(machine) : undefined}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4 px-2">
              <span className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <MachineDeleteDialog
        machine={selectedMachine}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
