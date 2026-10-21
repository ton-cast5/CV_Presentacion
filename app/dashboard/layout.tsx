import Link from "next/link";
import { DashboardNav } from "@/components/layout/DashboardNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="bg-atmosphere min-h-screen">
      <header className="border-b border-line/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="font-display text-xl font-semibold text-navy">
            CV Presentación
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-mist"
            >
              Salir
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[200px_1fr]">
        <aside>
          <DashboardNav />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
