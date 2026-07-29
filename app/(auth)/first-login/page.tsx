import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser, getCurrentUser } from "@/lib/auth/get-current-user";
import { FirstLoginForm } from "@/components/profile/first-login-form";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Complete Your Profile — DDC Maintenance",
  description:
    "Set up your business profile to access the DDC Maintenance system.",
};

function FirstLoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải thông tin...</p>
      </div>
    </div>
  );
}

async function FirstLoginContent() {
  // If already has a full profile, go straight to dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect("/machines");
  }

  // Must at least be signed in via Google
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login");
  }

  return (
    <FirstLoginForm
      sessionName={sessionUser.name}
      sessionEmail={sessionUser.email}
    />
  );
}

export default function FirstLoginPage() {
  return (
    <>
      <Suspense fallback={<FirstLoginSkeleton />}>
        <FirstLoginContent />
      </Suspense>
      <Toaster position="top-right" richColors />
    </>
  );
}
