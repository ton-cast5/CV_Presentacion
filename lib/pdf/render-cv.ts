import { existsSync } from "fs";
import { buildCvHtml } from "@/lib/pdf/cv-html";
import type { CvData } from "@/lib/types";

export async function renderCvPdf(data: CvData): Promise<Uint8Array> {
  const html = buildCvHtml(data);
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");
    const browser = await puppeteer.default.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      return new Uint8Array(pdf);
    } finally {
      await browser.close();
    }
  }

  const puppeteer = await import("puppeteer-core");
  const executablePath = findLocalChrome();
  if (!executablePath) {
    throw new Error(
      "No se encontró Chrome/Edge local. Instala Chrome o despliega en Vercel para generar el PDF del CV.",
    );
  }

  const browser = await puppeteer.default.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return new Uint8Array(pdf);
  } finally {
    await browser.close();
  }
}

function findLocalChrome(): string | null {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
          "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        ]
      : process.platform === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
          ];

  for (const p of candidates) {
    if (existsSync(/*turbopackIgnore: true*/ p)) return p;
  }
  return null;
}
