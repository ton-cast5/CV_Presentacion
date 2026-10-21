import { SimpleListCrud } from "@/components/dashboard/SimpleListCrud";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CertificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("certifications")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order");

  return (
    <SimpleListCrud
      title="Certificaciones (lista del CV)"
      table="certifications"
      profileId={user.id}
      items={data ?? []}
      fields={[
        { key: "titulo", label: "Título" },
        { key: "emisor", label: "Emisor / institución" },
        { key: "vigencia", label: "Vigencia", placeholder: "2025 - 2027" },
        { key: "icono", label: "Icono (opcional)", placeholder: "▣" },
      ]}
    />
  );
}
