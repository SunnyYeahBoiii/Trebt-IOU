import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { registerToastHandler } from "@/lib/toast";
import { ToastContext, type ToastType } from "./toast-context";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => registerToastHandler(addToast), [addToast]);

  const typeClasses: Record<Toast["type"], string> = {
    info: "bg-(--btn) text-[oklch(0.98_0.006_214)]",
    success: "bg-(--ac-state) text-(--text)",
    error: "bg-(--err-state) text-(--err)",
  };

  return (
    <ToastContext.Provider
      value={{
        toast: addToast,
        success: (message) => addToast(message, "success"),
        error: (message) => addToast(message, "error"),
      }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${typeClasses[t.type]}`}
            role="alert"
          >
            <span className="text-sm">{t.message}</span>
            <Button variant="ghost" onClick={() => removeToast(t.id)} className="px-1 py-0 text-xs">
              ✕
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
