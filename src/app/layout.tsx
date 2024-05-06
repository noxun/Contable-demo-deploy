import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Noxun - Sistema Contable",
  description:
    "El mejor sistema para optimizar todos los procesos contables de tu empresa o negocio.",
};
