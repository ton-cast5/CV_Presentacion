import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { publicStorageUrl } from "@/lib/cv-data";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/lib/types";

export default async function ProfilePage() {
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

  if (!profile) {
    return <p>No se encontró el perfil. Vuelve a iniciar sesión.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-semibold text-navy">Perfil</h1>
      <p className="text-sm text-ink/60">
        Datos que alimentan tu hoja de CV y la página pública.
      </p>
      <div className="rounded-xl border border-line bg-white/90 p-6">
        <ProfileForm
          profile={profile as Profile}
          photoUrl={publicStorageUrl("avatars", profile.foto_path)}
        />
      </div>
    </div>
  );
}
