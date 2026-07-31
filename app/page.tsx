import Image from "next/image";
import { Suspense } from "react";
import UserInfo from "./(auth)/login/_component/user-info";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/first-login");
}
