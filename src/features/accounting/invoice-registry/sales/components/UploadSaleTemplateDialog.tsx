import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UploadSaleTemplateSchema,
  uploadSaleTemplateSchema,
} from "../schemas/uploadSaleTemplateSchema";
import { Input } from "@/components/ui/input";
import { useUploadSaleTemplate } from "../hooks/useUploadSaleTemplate";

export function UploadSaleTemplateDialog() {
  const form = useForm<UploadSaleTemplateSchema>({
    resolver: zodResolver(uploadSaleTemplateSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const uploadSaleTemplateMutation = useUploadSaleTemplate();

  function onSubmit(data: UploadSaleTemplateSchema) {
    // Handle file upload logic here
    console.log("File uploaded:", data.file);
    uploadSaleTemplateMutation.mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Subir Plantilla de Ventas</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir Plantilla de Ventas</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="file"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subir plantilla de ventas</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              field.onChange(e.target.files[0]);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Selecciona un archivo de plantilla de ventas en formato
                        Excel (.xlsx).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={uploadSaleTemplateMutation.isPending}
                >
                  {uploadSaleTemplateMutation.isPending
                    ? "Subiendo..."
                    : "Subir Plantilla"}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
