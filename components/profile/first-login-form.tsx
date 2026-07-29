"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { Card } from "@/components/ui/card";
import { selfRegisterProfileAction } from "@/app/actions/profile/self-register-profile.action";
import { USER_ROLE_VN_LABELS, UserRole } from "@/constants/roles";
import { workshops } from "@/data/workshops";
import { teams } from "@/data/teams";
import { User, Loader2 } from "lucide-react";

interface FirstLoginFormProps {
  sessionName: string;
  sessionEmail: string;
}

const formSchema = z.object({
  employeeCode: z
    .string()
    .min(1, "Vui lòng nhập mã nhân viên")
    .max(20, "Mã nhân viên tối đa 20 ký tự")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Mã nhân viên chỉ gồm chữ in hoa, số, gạch dưới hoặc gạch ngang",
    ),
  email: z.string().min(1, "Email không được để trống"),
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  role: z.enum([UserRole.WORKER, UserRole.TECHNICIAN]),
  workshopId: z.string().min(1, "Vui lòng chọn xưởng làm việc"),
  teamId: z.string().min(1, "Vui lòng chọn tổ làm việc"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function FirstLoginForm({
  sessionName,
  sessionEmail,
}: FirstLoginFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeCode: "",
      fullName: sessionName || "",
      role: UserRole.WORKER,
      workshopId: workshops[0]?._id || "",
      teamId:
        teams.find((team) => team.workshopId === workshops[0]?._id)?._id || "",
      phone: "",
      email: sessionEmail,
    },
  });

  const selectedWorkshopId = form.watch("workshopId");

  const filteredTeams = useMemo(
    () => teams.filter((team) => team.workshopId === selectedWorkshopId),
    [selectedWorkshopId],
  );

  const handleCreateUser = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await selfRegisterProfileAction({
        fullName: data.fullName,
        employeeCode: data.employeeCode,
        role: data.role,
        workshopId: data.workshopId,
        teamId: data.teamId,
        phone: data.phone,
      });

      if (!res.success) {
        if (res.error.code === "CONFLICT") {
          form.setError("employeeCode", {
            type: "manual",
            message: res.error.message,
          });
        } else if (
          res.error.code === "VALIDATION_ERROR" &&
          res.error.details &&
          !Array.isArray(res.error.details)
        ) {
          const detailsObj = res.error.details as Record<
            string,
            string[] | string | undefined
          >;
          Object.entries(detailsObj).forEach(([key, messages]) => {
            const msg = Array.isArray(messages) ? messages[0] : messages;
            if (msg) {
              form.setError(key as keyof FormData, {
                type: "manual",
                message: msg,
              });
            }
          });
        }
        toast.error(res.error.message || "Tạo hồ sơ thất bại");
        return;
      }

      toast.success("Tạo hồ sơ thành công! Đang chuyển hướng...");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Hoàn tất hồ sơ của bạn
          </h1>
          <p className="text-sm text-muted-foreground">
            Để truy cập vào hệ thống. Hãy điền thông tin bên dưới
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-5 space-y-4">
          <p className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Thông tin nhân viên
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateUser)}
              className="space-y-4"
              id="create-user-form"
            >
              {/* Full Name & Employee Code Grid */}
              <div className="grid grid-cols-2 gap-x-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã nhân viên</FormLabel>
                      <FormControl>
                        <Input placeholder="NV001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ Email</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!!sessionEmail} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role & Phone Grid */}
              <div className="grid grid-cols-2 gap-x-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Chức vụ</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {USER_ROLE_VN_LABELS[field.value] ??
                                "Chọn chức vụ"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserRole.WORKER}>
                              {USER_ROLE_VN_LABELS[UserRole.WORKER]}
                            </SelectItem>

                            <SelectItem value={UserRole.TECHNICIAN}>
                              {USER_ROLE_VN_LABELS[UserRole.TECHNICIAN]}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="0901234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Workshop & Team Grid */}
              <div className="grid grid-cols-2 gap-x-4">
                <FormField
                  control={form.control}
                  name="workshopId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Xưởng làm việc</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const defaultTeam = teams.find(
                              (team) => team.workshopId === value,
                            );
                            if (defaultTeam) {
                              form.setValue("teamId", defaultTeam._id);
                            }
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn xưởng">
                              {workshops.find((w) => w._id === field.value)
                                ?.workshopName ?? "Chọn xưởng"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {workshops.map((workshop) => (
                              <SelectItem
                                key={workshop._id}
                                value={workshop._id}
                              >
                                {workshop.workshopName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Tổ làm việc</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                          disabled={filteredTeams.length === 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn tổ">
                              {filteredTeams.find((t) => t._id === field.value)
                                ?.teamName ?? "Chọn tổ"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {filteredTeams.map((team) => (
                              <SelectItem key={team._id} value={team._id}>
                                {team.teamName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                form="create-user-form"
                className="w-full bg-brand hover:bg-brand"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                    lưu...
                  </>
                ) : (
                  "Lưu thông tin"
                )}
              </Button>
            </form>
          </Form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Nếu bạn có chức vụ là Tổ trưởng/Trưởng phòng bảo trì hoặc các chức vụ
          khác không có trong lựa chọn. Hãy liên hệ đến mail anhddp@daidung.vn
        </p>
      </div>
    </div>
  );
}
