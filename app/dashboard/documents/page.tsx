import { DocumentsManager } from "@/components/documents/DocumentsManager";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { DocumentRow } from "@/lib/types";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order");

  return (
    <DocumentsManager
      profileId={user.id}
      initialDocs={(data ?? []) as DocumentRow[]}
    />
  );
}
