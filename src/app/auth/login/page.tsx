import LoginForm from "@/features/accounting/auth/components/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-[url('/cool-background.svg')]">
      <Card className="w-auto">
        <CardHeader className="text-center">
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
