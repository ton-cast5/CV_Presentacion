import { CopyLink } from "@/components/dashboard/CopyLink";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
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
  const publicUrl = `${proto}://${host}/cv/${profile?.slug ?? ""}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Hola{profile?.nombre ? `, ${profile.nombre}` : ""}
        </h1>
        <p className="mt-2 text-ink/70">
          Edita tu CV, sube documentos y comparte tu link público (solo lectura).
        </p>
      </div>

      <section className="rounded-xl border border-line bg-white/90 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy/70">
          Link público
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Quien abra este enlace puede ver y descargar, no editar.
        </p>
        <div className="mt-4">
          <CopyLink url={publicUrl} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Button href="/dashboard/profile" variant="secondary" className="justify-start py-4">
          Completar perfil
        </Button>
        <Button href="/dashboard/documents" variant="secondary" className="justify-start py-4">
          Subir documentos
        </Button>
        <Button href="/dashboard/export" className="justify-start py-4 sm:col-span-2">
          Exportar PDF compuesto
        </Button>
      </section>
    </div>
  );
}
