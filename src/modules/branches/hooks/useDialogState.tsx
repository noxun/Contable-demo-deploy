import {useState} from "react";

type status = "edit" | "delete" | null

interface DialogState<T> {
  type: status
  branch: T | null
}

export function useDialogState<T>() {
  const [dialogData, setDialogData] = useState<DialogState<T>>({ type: null, branch: null });

  const openDialog = (type: status, branch: T) => {
    setDialogData({ type, branch });
  };

  const closeDialog = () => {
    setDialogData({ type: null, branch: null });
  };

  return { dialogData, openDialog, closeDialog };
};