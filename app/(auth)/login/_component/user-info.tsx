import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { headers } from "next/headers";

export default async function UserInfo() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <p>{session?.user?.email}</p>;
}
