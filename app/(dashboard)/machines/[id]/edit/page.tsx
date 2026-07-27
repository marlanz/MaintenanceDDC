import connectDB from "@/lib/mongoose";
import Workshop from "@/models/workshop.model";
import Team from "@/models/team.model";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { can } from "@/lib/permissions/can";
import { PermissionAction } from "@/constants/permissions";
import { getMachineAction } from "@/app/actions/machine/get-machine.action";
import { MachineForm } from "@/components/machines/machine-form";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMachinePage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const allowed = can(user, PermissionAction.MACHINE_UPDATE, {
    type: "Machine",
    id,
  });
  if (!allowed) {
    redirect(`/machines/${id}`);
  }

  const res = await getMachineAction(id);
  if (!res.success) {
    notFound();
  }

  await connectDB();

  const [workshopsDocs, teamsDocs] = await Promise.all([
    Workshop.find().sort({ workshopName: 1 }).lean(),
    Team.find().sort({ teamName: 1 }).lean(),
  ]);

  const workshops = workshopsDocs.map((w) => ({
    id: w._id.toString(),
    name: w.workshopName,
  }));

  const teams = teamsDocs.map((t) => ({
    id: t._id.toString(),
    name: t.teamName,
    workshopId: t.workshopId.toString(),
  }));

  return (
    <div className="py-4">
      <MachineForm
        initialData={res.data}
        workshops={workshops}
        teams={teams}
        isEdit={true}
      />
    </div>
  );
}
