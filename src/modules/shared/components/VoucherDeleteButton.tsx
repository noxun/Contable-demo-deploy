"use client";
import { PropsWithChildren } from "react";
import { token } from "../constants/token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VoucherType } from "../types/sharedTypes";

type VoucherDeleteButtonProps = {
  id: number;
  voucherType: VoucherType;
} & PropsWithChildren;

export default function VoucherDeleteButton({
  children,
  id,
  voucherType,
}: VoucherDeleteButtonProps) {
  const queryClient = useQueryClient();
  const voucherDeleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: number; type: VoucherType }) => {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher?id=${id}&type=${type}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Voucher borrado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["VoucherIncome"] });
    },
    onError: () => {},
  });

  return (
    <Button
      onClick={() => {
        voucherDeleteMutation.mutate({ id, type: voucherType });
      }}
    >
      {children}
    </Button>
  );
}
