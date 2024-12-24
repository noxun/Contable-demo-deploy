import { useState } from "react";

type status = "edit" | "delete" | null

interface DialogState<T> {
  type: status
  user: T | null
}

export function useDialogState<T>() {
  const [dialogData, setDialogData] = useState<DialogState<T>>({ type: null, user: null });

  const openDialog = (type: status, user: T) => {
    setDialogData({ type, user });
  };

  const closeDialog = () => {
    setDialogData({ type: null, user: null });
  };

  return { dialogData, openDialog, closeDialog };
};