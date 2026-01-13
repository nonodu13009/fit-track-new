import { useState } from "react";

interface AlertState {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  variant?: "danger" | "warning" | "info";
}

export function useAlertDialog() {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  const showAlert = (
    message: string,
    onConfirm: () => void,
    options?: {
      title?: string;
      variant?: "danger" | "warning" | "info";
    }
  ) => {
    setAlertState({
      isOpen: true,
      message,
      onConfirm,
      title: options?.title,
      variant: options?.variant || "danger",
    });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const confirmAlert = () => {
    alertState.onConfirm();
    closeAlert();
  };

  return {
    alertState,
    showAlert,
    closeAlert,
    confirmAlert,
  };
}
