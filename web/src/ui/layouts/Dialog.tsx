import { useEffect, useRef, ReactNode, HTMLAttributes, forwardRef } from "react";

export interface DialogProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ open, onClose, title, children, className = "", ...props }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Sync open state
    useEffect(() => {
      const el = dialogRef.current;
      if (!el) return;
      if (open && !el.open) {
        el.showModal();
      } else if (!open && el.open) {
        el.close();
      }
    }, [open]);

    // Focus trap
    useEffect(() => {
      if (!open) return;
      const el = dialogRef.current;
      if (!el) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const focusable = el.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      el.addEventListener("keydown", handleKeyDown);
      return () => el.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    };

    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <dialog
          ref={ref ?? dialogRef}
          className={`rounded-2xl bg-(--btn) p-6 shadow-xl max-h-[90vh] w-full max-w-lg overflow-y-auto ${className}`}
          aria-modal="true"
          aria-labelledby="dialog-title"
          onCancel={onClose}
          {...props}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="dialog-title" className="text-lg font-semibold text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors text-xl leading-none"
              aria-label="Close dialog"
            >
              ×
            </button>
          </div>
          {children}
        </dialog>
      </div>
    );
  }
);

Dialog.displayName = "Dialog";
