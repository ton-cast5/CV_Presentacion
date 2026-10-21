import { SimpleListCrud } from "@/components/dashboard/SimpleListCrud";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ExperiencePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("experience")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order");

  return (
    <SimpleListCrud
      title="Experiencia laboral"
      table="experience"
      profileId={user.id}
      items={data ?? []}
      fields={[
        { key: "puesto", label: "Puesto" },
        { key: "empresa", label: "Empresa" },
        { key: "fechas", label: "Fechas", placeholder: "2023 - 2024" },
        { key: "bullets", label: "Logros / funciones", type: "bullets" },
      ]}
    />
  );
}
