import { redirect } from "next/navigation";
import connectDB from "@/lib/mongoose";
import Workshop from "@/models/workshop.model";
import Team from "@/models/team.model";
import { getSessionUser } from "@/lib/auth/get-current-user";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { FirstLoginForm } from "@/components/profile/first-login-form";
import { Toaster } from "@/components/ui/sonner";
import fs from "fs/promises";
import path from "path";

export const metadata = {
  title: "Complete Your Profile — DDC Maintenance",
  description:
    "Set up your business profile to access the DDC Maintenance system.",
};

export default async function FirstLoginPage() {
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

  // Try DB first; if it fails or returns no docs, fall back to local fixtures
  await connectDB();

  let workshopsDocs: any[] = [];
  let teamsDocs: any[] = [];

  try {
    const results = await Promise.all([
      Workshop.find().sort({ workshopName: 1 }).lean(),
      Team.find().sort({ teamName: 1 }).lean(),
    ]);
    workshopsDocs = results[0] ?? [];
    teamsDocs = results[1] ?? [];
    // If either collection is empty, trigger the fallback to fixtures
    if (!workshopsDocs.length || !teamsDocs.length) {
      throw new Error("Empty DB collections — falling back to fixtures");
    }
  } catch (err) {
    console.log(err);
    const dataDir = path.join(process.cwd(), "data");
    const readJson = async (fileName: string) => {
      try {
        const raw = await fs.readFile(path.join(dataDir, fileName), "utf8");
        return JSON.parse(raw);
      } catch (err) {
        console.log(err);
        return [];
      }
    };

    workshopsDocs = await readJson("workshops.json");
    teamsDocs = await readJson("teams.json");
  }

  // Use workshop and team NAMES as the select values.
  // If reading from the DB, resolve team.workshopId -> workshopName via a lookup map.
  const workshopLookupById = new Map<string, string>();
  for (const w of workshopsDocs) {
    const key = w._id?.toString ? w._id.toString() : String(w._id ?? w.id);
    const name = w.workshopName ?? w.name ?? "";
    workshopLookupById.set(key, name);
  }

  const workshops = workshopsDocs.map((w) => ({
    id: (w.workshopName ?? w.name ?? "") as string,
    name: w.workshopName ?? w.name ?? "",
  }));

  const teams = teamsDocs.map((t) => {
    const teamName = t.teamName ?? t.name ?? "";
    // team.workshopId may be an ObjectId, a string id, or already the workshop name
    let workshopName = "";
    if (t.workshopId) {
      if (typeof t.workshopId === "string") {
        // could be either id string or name
        workshopName = workshopLookupById.get(t.workshopId) ?? t.workshopId;
      } else if (t.workshopId.toString) {
        const key = t.workshopId.toString();
        workshopName = workshopLookupById.get(key) ?? key;
      }
    } else if (t.workshop) {
      workshopName = t.workshop;
    }

    return {
      id: teamName,
      name: teamName,
      workshopId: workshopName,
    };
  });

  return (
    <>
      <FirstLoginForm
        sessionName={sessionUser.name}
        sessionEmail={sessionUser.email}
        workshops={workshops}
        teams={teams}
      />
      <Toaster position="top-right" richColors />
    </>
  );
}
