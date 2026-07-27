import connectDB from "@/lib/mongoose";
import Workshop from "@/models/workshop.model";
import Team from "@/models/team.model";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { can } from "@/lib/permissions/can";
import { PermissionAction } from "@/constants/permissions";
import { MachineForm } from "@/components/machines/machine-form";
import { redirect } from "next/navigation";

export default async function NewMachinePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const allowed = can(user, PermissionAction.MACHINE_CREATE, { type: "Machine" });
  if (!allowed) {
    redirect("/machines");
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
      <MachineForm workshops={workshops} teams={teams} isEdit={false} />
    </div>
  );
}
