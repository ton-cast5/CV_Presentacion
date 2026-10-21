import { SimpleListCrud } from "@/components/dashboard/SimpleListCrud";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EducationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("education")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order");

  return (
    <SimpleListCrud
      title="Formación académica"
      table="education"
      profileId={user.id}
      items={data ?? []}
      fields={[
        { key: "nivel", label: "Nivel", placeholder: "SECUNDARIA" },
        { key: "institucion", label: "Institución" },
        { key: "lugar", label: "Lugar" },
      ]}
    />
  );
}
