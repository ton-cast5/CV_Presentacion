import { DashboardShell } from "@/components/layout/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  const slug = profile?.slug ?? "";
  const publicUrl = `${proto}://${host}/cv/${slug}`;
  const name =
    `${profile?.nombre ?? ""} ${profile?.apellido ?? ""}`.trim() ||
    user.email ||
    "Usuario";

  return (
    <DashboardShell
      name={name}
      roles={profile?.roles ?? []}
      publicUrl={publicUrl}
      publicHref={`/cv/${slug}`}
    >
      {children}
    </DashboardShell>
  );
}
