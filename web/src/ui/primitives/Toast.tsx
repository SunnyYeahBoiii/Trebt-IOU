import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Button } from "./Button";

interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error";
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalToast: ((message: string, type: Toast["type"]) => void) | null = null;

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

  // Expose global API
  globalToast = addToast;

  const typeClasses: Record<Toast["type"], string> = {
    info: "bg-(--btn) text-white",
    success: "bg-(--ac) text-black",
    error: "bg-(--err) text-white",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast, success: addToast, error: addToast }}>
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

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// Imperative API for use outside React components
export function showToast(message: string, type: Toast["type"] = "info") {
  globalToast?.(message, type);
}
