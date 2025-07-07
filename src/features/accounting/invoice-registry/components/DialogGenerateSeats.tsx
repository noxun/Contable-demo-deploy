import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  GeneratePurchaseSeatFormSchema,
  generatePurchaseSeatFormSchema,
} from "../purchases/schemas/generatePurchaseSeatFormSchema";
import { useGeneratePurchaseSeats } from "../purchases/hooks/useGeneratePurchaseSeats";
import { GenerateSeatSelect } from "./GenerateSeatsSelect";

type Props = {
  mode: "purchase" | "sale";
};

export function DialogGenerateSeats({ mode }: Props) {
  const form = useForm<GeneratePurchaseSeatFormSchema>({
    resolver: zodResolver(generatePurchaseSeatFormSchema),
    defaultValues: {
      type: 0,
    },
  });

  const generatePurchaseSeatsMutation = useGeneratePurchaseSeats();

  function onSubmit(values: GeneratePurchaseSeatFormSchema) {
    console.log("Form submitted with values:", values);
    if (mode === "purchase") {
      generatePurchaseSeatsMutation.mutate(values.type);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Generar Asientos</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Generar asientos de {mode === "purchase" ? "Compra" : "Venta"}
          </DialogTitle>
          <DialogDescription>
            Esta funcionalidad te permite generar asientos contables de forma
            automática para las {mode === "purchase" ? "compras" : "ventas"}.
            Selecciona la modalidad de generación de asientos y confirma la
            operación.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidad de generación de asientos</FormLabel>
                  <FormControl>
                    <GenerateSeatSelect
                      value={field.value?.toString() || ""}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecciona la modalidad para generar asientos automáticos.
                    Puedes elegir entre generar un asiento por cada item, o
                    agruparlos por día o mes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={generatePurchaseSeatsMutation.isPending}
            >
              {generatePurchaseSeatsMutation.isPending
                ? "Generando..."
                : "Generar Asientos"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
