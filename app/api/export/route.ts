import { NextResponse } from "next/server";
import { loadCvByUserId } from "@/lib/cv-data";
import { mergeParts, isImageMime, isPdfMime, type MergePart } from "@/lib/pdf/merge";
import { renderCvPdf } from "@/lib/pdf/render-cv";
import { createClient } from "@/lib/supabase/server";
import type { ExportItem } from "@/lib/types";

export const maxDuration = 60;
export const runtime = "nodejs";

type Body = {
  items: ExportItem[];
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = (await request.json()) as Body;
    if (!body?.items?.length) {
      return NextResponse.json({ error: "Sin elementos para exportar" }, { status: 400 });
    }

    const cvData = await loadCvByUserId(supabase, user.id);
    if (!cvData) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const parts: MergePart[] = [];

    for (const item of body.items) {
      if (item.type === "cv") {
        const cvBytes = await renderCvPdf(cvData);
        parts.push({ kind: "pdf", bytes: cvBytes });
        continue;
      }

      if (item.type === "doc") {
        const doc = cvData.documents?.find((d) => d.id === item.id);
        if (!doc) continue;

        const { data: file, error } = await supabase.storage
          .from("documents")
          .download(doc.storage_path);

        if (error || !file) {
          return NextResponse.json(
            { error: `No se pudo leer: ${doc.nombre}` },
            { status: 400 },
          );
        }

        const bytes = new Uint8Array(await file.arrayBuffer());
        if (isPdfMime(doc.mime_type)) {
          parts.push({ kind: "pdf", bytes });
        } else if (isImageMime(doc.mime_type)) {
          // webp not supported by pdf-lib — convert hint: skip or treat as png fail
          if (doc.mime_type.includes("webp")) {
            return NextResponse.json(
              {
                error: `El archivo "${doc.nombre}" es WEBP. Convierte a JPG/PNG/PDF para exportar.`,
              },
              { status: 400 },
            );
          }
          parts.push({ kind: "image", bytes, mimeType: doc.mime_type });
        } else {
          return NextResponse.json(
            { error: `Tipo no soportado: ${doc.nombre}` },
            { status: 400 },
          );
        }
        continue;
      }

      if (item.type === "external") {
        const raw = Buffer.from(item.dataBase64, "base64");
        const bytes = new Uint8Array(raw);
        if (isPdfMime(item.mimeType)) {
          parts.push({ kind: "pdf", bytes });
        } else if (isImageMime(item.mimeType)) {
          if (item.mimeType.includes("webp")) {
            return NextResponse.json(
              { error: "WEBP externo no soportado. Usa JPG/PNG/PDF." },
              { status: 400 },
            );
          }
          parts.push({ kind: "image", bytes, mimeType: item.mimeType });
        }
      }
    }

    if (!parts.length) {
      return NextResponse.json({ error: "Nada que unir" }, { status: 400 });
    }

    const merged = await mergeParts(parts);
    const filename = `CV-${cvData.profile.slug}.pdf`;

    return new NextResponse(Buffer.from(merged), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al exportar";
    console.error("export error", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
