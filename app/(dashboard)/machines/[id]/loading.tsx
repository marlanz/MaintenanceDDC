import { MachineDetailSkeleton } from "@/components/machines/machine-skeleton";

export default function MachineDetailLoading() {
  return (
    <div className="py-4">
      <MachineDetailSkeleton />
    </div>
  );
}
