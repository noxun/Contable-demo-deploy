import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MailCheck } from "lucide-react";
import React from "react";

export const ButtonSendEmail = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button
            style={{ backgroundColor: "#f5a524", color: "black" }}
            variant="default"
          >
            <span className="mr-1">Enviar correo</span>
            <MailCheck size={18} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full flex flex-col items-center justify-center p-4 border-none">
          <div className="">
            <h4 className="font-semibold text-lg mb-2">Enviar correo</h4>
            <p className="mb-2">
              ¿Estas seguro quieres enviar el correo al cliente con la planilla
              y factura?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button variant="default">Enviar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
