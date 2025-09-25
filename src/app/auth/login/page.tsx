import LoginForm from "@/features/accounting/auth/components/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { APP_LOGO_URL } from "@/lib/constants";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-[url('/images/fondo-contenedor.png')]">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm z-0" />
        <Card className="rounded-3xl shadow-2xl bg-white/30 backdrop-blur-md border border-yellow-400">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#052f47] ">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <Image
            src={APP_LOGO_URL}
            alt="Logo"
            width={275}
            height={100}
            className="pl-5 pr-5 mb-8"
          />
        </Card>
    </main>
  );
}
