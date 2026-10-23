import { SimpleListCrud } from "@/components/dashboard/SimpleListCrud";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order");

  return (
    <SimpleListCrud
      title="Proyectos"
      table="projects"
      profileId={user.id}
      items={data ?? []}
      fields={[
        { key: "titulo", label: "Título" },
        { key: "descripcion", label: "Descripción", type: "textarea" },
        { key: "fechas", label: "Fechas (opcional)" },
        {
          key: "link",
          label: "Link del proyecto (opcional)",
          placeholder: "https://github.com/... o demo",
        },
      ]}
    />
  );
}
