import connectDB from "@/lib/mongoose";
import Workshop from "@/models/workshop.model";
import Team from "@/models/team.model";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { can } from "@/lib/permissions/can";
import { PermissionAction } from "@/constants/permissions";
import { listMachinesAction } from "@/app/actions/machine/list-machines.action";
import { MachineSearchBar } from "@/components/machines/machine-search-bar";
import { MachineFilterBar } from "@/components/machines/machine-filter-bar";
import { MachineListClient } from "@/components/machines/machine-list-client";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    workshopId?: string;
    teamId?: string;
    status?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function MachinesPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;

  await connectDB();

  // Load workshop and team filter options
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

  // Fetch paginated machines using Server Action logic
  const res = await listMachinesAction({
    query: params.query,
    workshopId: params.workshopId,
    teamId: params.teamId,
    status: params.status,
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: params.limit ? parseInt(params.limit, 10) : 10,
  });

  const canCreate = can(user, PermissionAction.MACHINE_CREATE, { type: "Machine" });
  const canEdit = can(user, PermissionAction.MACHINE_UPDATE, { type: "Machine" });
  const canDelete = can(user, PermissionAction.MACHINE_DELETE, { type: "Machine" });

  const paginatedResult = res.success
    ? res.data
    : {
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-4 rounded-lg border">
        <MachineSearchBar />
        <MachineFilterBar workshops={workshops} teams={teams} />
      </div>

      {/* Main List */}
      <MachineListClient
        paginatedResult={paginatedResult}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
      />
    </div>
  );
}
