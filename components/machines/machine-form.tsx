"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createMachineSchema, type CreateMachineInput } from "@/schemas/machine.schema";
import { ALL_MAINTENANCE_CYCLES, MaintenanceCycleType } from "@/constants/maintenance-cycle";
import { ALL_MACHINE_STATUSES, MACHINE_STATUS_LABELS } from "@/constants/machine-status";
import { createMachineAction } from "@/app/actions/machine/create-machine.action";
import { updateMachineAction } from "@/app/actions/machine/update-machine.action";
import type { MachineListItem } from "@/types/machine.types";

interface Option {
  id: string;
  name: string;
  workshopId?: string;
}

interface MachineFormProps {
  initialData?: MachineListItem;
  workshops: Option[];
  teams: Option[];
  isEdit?: boolean;
}

export function MachineForm({
  initialData,
  workshops,
  teams,
  isEdit = false,
}: MachineFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateMachineInput>({
    resolver: zodResolver(createMachineSchema),
    defaultValues: {
      machineCode: initialData?.machineCode || "",
      machineName: initialData?.machineName || "",
      serialNumber: initialData?.serialNumber || "",
      workshopId: initialData?.workshopId || (workshops[0]?.id ?? ""),
      teamId: initialData?.teamId || (teams[0]?.id ?? ""),
      categoryId: initialData?.categoryId || "",
      manufacturer: initialData?.manufacturer || "",
      model: initialData?.model || "",
      installDate: initialData?.installDate ? initialData.installDate.slice(0, 10) : "",
      maintenanceCycle: {
        type: (initialData?.maintenanceCycle?.type as MaintenanceCycleType) || "MONTHLY",
        value: initialData?.maintenanceCycle?.value || 1,
      },
      currentStatus: initialData?.currentStatus || "OPERATIONAL",
      note: initialData?.note || "",
    },
  });

  const selectedWorkshopId = form.watch("workshopId");
  const filteredTeams = teams.filter(
    (team) => !team.workshopId || team.workshopId === selectedWorkshopId
  );

  const onSubmit = async (values: CreateMachineInput) => {
    try {
      setIsSubmitting(true);

      if (isEdit && initialData) {
        const res = await updateMachineAction(initialData.id, values);
        if (res.success) {
          toast.success("Machine updated successfully");
          router.push(`/machines/${initialData.id}`);
          router.refresh();
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createMachineAction(values);
        if (res.success) {
          toast.success("Machine created successfully");
          router.push(`/machines/${res.data.id}`);
          router.refresh();
        } else {
          toast.error(res.error.message);
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Machine" : "Create New Machine"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Code & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="machineCode"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "machineCode"> }) => (
                  <FormItem>
                    <FormLabel>Machine Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. CNC-01"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="machineName"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "machineName"> }) => (
                  <FormItem>
                    <FormLabel>Machine Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. CNC Milling Lathe A"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Workshop & Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workshopId"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "workshopId"> }) => (
                  <FormItem>
                    <FormLabel>Workshop (Xưởng) *</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        if (val !== null) {
                          field.onChange(val);
                          const matchingTeams = teams.filter((t) => t.workshopId === val);
                          if (matchingTeams.length > 0) {
                            form.setValue("teamId", matchingTeams[0].id);
                          } else {
                            form.setValue("teamId", "");
                          }
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select workshop" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workshops.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamId"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "teamId"> }) => (
                  <FormItem>
                    <FormLabel>Team (Tổ) *</FormLabel>
                    <Select
                      onValueChange={(val) => val !== null && field.onChange(val)}
                      value={field.value}
                      disabled={filteredTeams.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              filteredTeams.length > 0
                                ? "Select team"
                                : "No teams available"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredTeams.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Maintenance Cycle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
              <FormField
                control={form.control}
                name="maintenanceCycle.type"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "maintenanceCycle.type"> }) => (
                  <FormItem>
                    <FormLabel>Maintenance Cycle Type *</FormLabel>
                    <Select
                      onValueChange={(val) => val !== null && field.onChange(val)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cycle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALL_MAINTENANCE_CYCLES.map((cycle) => (
                          <SelectItem key={cycle} value={cycle}>
                            {cycle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maintenanceCycle.value"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "maintenanceCycle.value"> }) => (
                  <FormItem>
                    <FormLabel>Cycle Interval (Value) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status & Serial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentStatus"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "currentStatus"> }) => (
                  <FormItem>
                    <FormLabel>Operational Status</FormLabel>
                    <Select
                      onValueChange={(val) => val !== null && field.onChange(val)}
                      defaultValue={field.value || "OPERATIONAL"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALL_MACHINE_STATUSES.map((statusKey) => (
                          <SelectItem key={statusKey} value={statusKey}>
                            {MACHINE_STATUS_LABELS[statusKey]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "serialNumber"> }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. SN-998811"
                        {...field}
                        value={field.value || ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Manufacturer & Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "manufacturer"> }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Siemens"
                        {...field}
                        value={field.value || ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "model"> }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. VF-2SS"
                        {...field}
                        value={field.value || ""}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Note */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }: { field: ControllerRenderProps<CreateMachineInput, "note"> }) => (
                <FormItem>
                  <FormLabel>Note / Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about machine specifications or history..."
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Machine"
                : "Create Machine"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
