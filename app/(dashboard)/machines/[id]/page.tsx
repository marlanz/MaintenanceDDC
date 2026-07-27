import { getCurrentUser } from "@/lib/auth/get-current-user";
import { can } from "@/lib/permissions/can";
import { PermissionAction } from "@/constants/permissions";
import { getMachineAction } from "@/app/actions/machine/get-machine.action";
import { MachineDetailView } from "@/components/machines/machine-detail-view";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MachineDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const res = await getMachineAction(id);
  if (!res.success) {
    notFound();
  }

  const machine = res.data;
  const canEdit = can(user, PermissionAction.MACHINE_UPDATE, {
    type: "Machine",
    id: machine.id,
  });

  return (
    <div className="py-4">
      <MachineDetailView machine={machine} canEdit={canEdit} />
    </div>
  );
}
