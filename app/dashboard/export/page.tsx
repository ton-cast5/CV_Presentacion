import { ExportBuilder } from "@/components/export/ExportBuilder";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { DocumentRow } from "@/lib/types";

export default async function ExportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("profile_id", user.id)
    .order("category")
    .order("sort_order");

  return <ExportBuilder documents={(data ?? []) as DocumentRow[]} />;
}
