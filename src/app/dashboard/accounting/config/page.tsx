import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import ConfigForm from "@/features/accounting/config/components/ConfigForm";

export default function ConfigPage() {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Ventana de Parámetros</CardTitle>
      </CardHeader>
      <CardContent>
        <ConfigForm />
      </CardContent>
    </Card>
  );
}
//
