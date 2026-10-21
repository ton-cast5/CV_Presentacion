import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-atmosphere flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="font-display text-3xl font-semibold text-navy">
        No encontrado
      </h1>
      <p className="mt-2 text-ink/60">Ese CV o página no existe.</p>
      <Link href="/" className="mt-6 font-semibold text-navy underline">
        Volver al inicio
      </Link>
    </div>
  );
}
