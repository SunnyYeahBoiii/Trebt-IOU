import type { ToastType } from "@/ui/primitives/toast-context";

type ToastHandler = (message: string, type: ToastType) => void;

let globalToast: ToastHandler | null = null;

export function registerToastHandler(handler: ToastHandler) {
  globalToast = handler;
  return () => {
    if (globalToast === handler) {
      globalToast = null;
    }
  };
}

export function showToast(message: string, type: ToastType = "info") {
  globalToast?.(message, type);
}
