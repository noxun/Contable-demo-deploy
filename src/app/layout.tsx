import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";
// import { Providers } from "@/modules/shared";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="es">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Noxun - Sistema Contable",
  description:
    "El mejor sistema para optimizar todos los procesos contables de tu empresa o negocio.",
};
