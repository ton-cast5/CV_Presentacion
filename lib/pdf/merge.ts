import {
  PDFDocument,
  PageSizes,
  rgb,
} from "pdf-lib";

export type MergePart =
  | { kind: "pdf"; bytes: Uint8Array }
  | { kind: "image"; bytes: Uint8Array; mimeType: string };

export async function mergeParts(parts: MergePart[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();

  for (const part of parts) {
    if (part.kind === "pdf") {
      const src = await PDFDocument.load(part.bytes, {
        ignoreEncryption: true,
      });
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p) => out.addPage(p));
      continue;
    }

    const page = out.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const margin = 36;
    const maxW = width - margin * 2;
    const maxH = height - margin * 2;

    let image;
    if (part.mimeType.includes("png")) {
      image = await out.embedPng(part.bytes);
    } else {
      image = await out.embedJpg(part.bytes);
    }

    const scale = Math.min(maxW / image.width, maxH / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(1, 1, 1),
    });
    page.drawImage(image, {
      x: (width - w) / 2,
      y: (height - h) / 2,
      width: w,
      height: h,
    });
  }

  return out.save();
}

export function isImageMime(mime: string) {
  return (
    mime.includes("jpeg") ||
    mime.includes("jpg") ||
    mime.includes("png") ||
    mime.includes("webp")
  );
}

export function isPdfMime(mime: string) {
  return mime.includes("pdf");
}
