import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="fc-card max-w-md p-8 text-center">
        <h1 className="text-[26px] font-semibold tracking-tight">No encontrado</h1>
        <p className="mt-2 text-[13px] text-muted">Ese CV o página no existe.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-[12px] bg-primary px-4 text-[13px] font-semibold text-white"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
