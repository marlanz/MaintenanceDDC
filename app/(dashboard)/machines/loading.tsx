import { MachineSkeletonList } from "@/components/machines/machine-skeleton";

export default function MachinesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-16 rounded-lg border bg-card/50 p-4" />
      <MachineSkeletonList />
    </div>
  );
}
