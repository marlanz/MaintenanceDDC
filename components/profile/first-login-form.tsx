"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { selfRegisterProfileAction } from "@/app/actions/profile/self-register-profile.action";
import { UserRole } from "@/constants/roles";
import { Wrench, User, Building2, Users } from "lucide-react";

interface FilterOption {
  id: string;
  name: string;
  workshopId?: string;
}

interface FirstLoginFormProps {
  sessionName: string;
  sessionEmail: string;
  workshops: FilterOption[];
  teams: FilterOption[];
}

const formSchema = z.object({
  employeeCode: z
    .string()
    .min(1, "Employee code is required")
    .max(20, "Max 20 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Uppercase letters, numbers, underscores or hyphens only",
    ),
  role: z.enum([UserRole.WORKER, UserRole.TECHNICIAN]),
  workshopId: z.string().min(1, "Please select a workshop"),
  teamId: z.string().min(1, "Please select a team"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function FirstLoginForm({
  sessionName,
  sessionEmail,
  workshops,
  teams,
}: FirstLoginFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeCode: "",
      role: UserRole.WORKER,
      workshopId: workshops[0]?.id || "",
      teamId: "",
      phone: "",
    },
  });

  const selectedWorkshopId = form.watch("workshopId");
  const filteredTeams = teams.filter(
    (t) => !t.workshopId || t.workshopId === selectedWorkshopId,
  );

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);
      const res = await selfRegisterProfileAction(values);

      if (res.success) {
        toast.success("Profile set up successfully! Welcome aboard.");
        router.push("/machines");
        router.refresh();
      } else {
        toast.error(res.error.message);
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            One more step before you can access the system.
          </p>
        </div>

        {/* Session Info Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-3">
            <div className="rounded-full bg-primary/10 h-9 w-9 flex items-center justify-center font-bold text-primary text-sm shrink-0">
              {sessionName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{sessionName}</p>
              <p className="text-xs text-muted-foreground">{sessionEmail}</p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Business Profile Setup
            </CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* Employee Code */}
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "employeeCode">;
                  }) => (
                    <FormItem>
                      <FormLabel>Employee Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. EMP001"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "role">;
                  }) => (
                    <FormItem>
                      <FormLabel>Your Role *</FormLabel>
                      <Select
                        onValueChange={(val) =>
                          val !== null && field.onChange(val)
                        }
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.WORKER}>
                            Worker (Công nhân)
                          </SelectItem>
                          <SelectItem value={UserRole.TECHNICIAN}>
                            Technician (Kỹ thuật viên)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Workshop */}
                <FormField
                  control={form.control}
                  name="workshopId"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "workshopId">;
                  }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> Workshop (Xưởng) *
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                          if (val !== null) {
                            field.onChange(val);
                            form.setValue("teamId", "");
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your workshop" />
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

                {/* Team */}
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "teamId">;
                  }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Team (Tổ) *
                      </FormLabel>
                      <Select
                        onValueChange={(val) =>
                          val !== null && field.onChange(val)
                        }
                        value={field.value}
                        disabled={filteredTeams.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                filteredTeams.length > 0
                                  ? "Select your team"
                                  : "Select a workshop first"
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

                {/* Phone (optional) */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormData, "phone">;
                  }) => (
                    <FormItem>
                      <FormLabel>Phone Number (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 0901234567"
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

              <CardFooter className="border-t pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Setting up your profile..."
                    : "Complete Setup & Enter System"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Your role and team assignment will be reviewed by your administrator.
          Higher roles (Team Leader, Manager) can only be assigned by an Admin.
        </p>
      </div>
    </div>
  );
}
