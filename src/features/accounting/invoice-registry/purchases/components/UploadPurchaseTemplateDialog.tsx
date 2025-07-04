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
  UploadPurchaseTemplateSchema,
  uploadPurchaseTemplateSchema,
} from "../schemas/uploadPurchaseTemplateSchema";
import { Input } from "@/components/ui/input";
import { useUploadPurchaseTemplate } from "../hooks/useUploadPurchaseTemplate";

export function UploadPurchaseTemplateDialog() {
  const form = useForm<UploadPurchaseTemplateSchema>({
    resolver: zodResolver(uploadPurchaseTemplateSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const uploadPurchaseTemplateMutation = useUploadPurchaseTemplate();

  function onSubmit(data: UploadPurchaseTemplateSchema) {
    // Handle file upload logic here
    console.log("File uploaded:", data.file);
    uploadPurchaseTemplateMutation.mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Subir Plantilla de Compras
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] overflow-y-auto h-[90%]">
        <DialogHeader>
          <DialogTitle>Subir Plantilla de Compras</DialogTitle>
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
                      <FormLabel>Subir plantilla de compras</FormLabel>
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
                        Selecciona un archivo de plantilla de compras en formato
                        Excel (.xlsx).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
