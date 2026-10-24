import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { FadeIn } from "@/components/motion/FadeIn";
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
      <FadeIn>
        <h1 className="text-[20px] font-semibold tracking-tight sm:text-[26px]">
          Perfil y datos personales
        </h1>
        <p className="mt-1 text-[13px] text-muted">
          Datos que alimentan tu hoja de CV y la página pública.
        </p>
      </FadeIn>
      <FadeIn delay={0.08}>
        <div className="fc-card p-6 sm:p-7">
          <ProfileForm
            profile={profile as Profile}
            photoUrl={publicStorageUrl("avatars", profile.foto_path)}
          />
        </div>
      </FadeIn>
    </div>
  );
}
