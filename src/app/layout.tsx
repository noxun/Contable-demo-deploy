import type { Metadata } from "next";
import "./globals.css";
import "@cyntler/react-doc-viewer/dist/index.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryClientProvider } from "./react-query-client-provider";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <ReactQueryClientProvider>
      <html lang="es" suppressHydrationWarning>
        <body className="">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>{children}</Providers>
            <Toaster expand richColors/>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}

export const metadata: Metadata = {
  title: "Noxun - Sistema Contable",
  description:
    "El mejor sistema para optimizar todos los procesos contables de tu empresa o negocio.",
};
