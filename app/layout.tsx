import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://cv-presentacion-wheat.vercel.app",
  ),
  title: {
    default: "FolioCraft — Dossier Engine",
    template: "%s · FolioCraft",
  },
  description:
    "Crea, comparte y exporta currículums con documentos adjuntos en un solo expediente PDF.",
  applicationName: "FolioCraft",
  appleWebApp: {
    capable: true,
    title: "FolioCraft",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/brand/foliocraft-logo.svg", type: "image/svg+xml" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/brand/icon-192.png"],
  },
  openGraph: {
    title: "FolioCraft",
    description:
      "Crea, comparte y exporta currículums con documentos adjuntos en un solo expediente PDF.",
    siteName: "FolioCraft",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#315C49",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Single opsz/wght — much smaller than full Material Symbols variable range */}
        <link
          id="material-symbols"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          rel="stylesheet"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.getElementById('material-symbols');if(!l)return;l.addEventListener('load',function(){l.media='all'});if(l.sheet)l.media='all';})();`,
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col font-sans text-on-surface bg-background">
        {children}
      </body>
    </html>
  );
}
