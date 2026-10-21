import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="relative z-10 border-b border-line/70 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-navy">
          CV Presentación
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Button href="/dashboard" variant="ghost">
                Panel
              </Button>
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="secondary">
                  Salir
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost">
                Entrar
              </Button>
              <Button href="/register">Crear cuenta</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
