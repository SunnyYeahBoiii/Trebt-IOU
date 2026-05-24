import { useEffect, useRef, forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export interface DialogProps extends Omit<HTMLAttributes<HTMLDialogElement>, "title"> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ open, onClose, title, children, className = "", ...props }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const setDialogRef = (node: HTMLDialogElement | null) => {
      dialogRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

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

    const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickedBackdrop =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

      if (clickedBackdrop) {
        onClose();
      }
    };

    return (
      <dialog
        ref={setDialogRef}
        className={`fixed left-1/2 top-1/2 z-40 m-0 max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-(--border) bg-(--surface) p-5 text-(--text) shadow-[var(--shadow)] ${className}`}
        aria-modal="true"
        aria-labelledby="dialog-title"
        onCancel={onClose}
        onClick={handleDialogClick}
        {...props}
      >
        <div className="mb-4 flex items-center justify-between border-b border-(--border) pb-3">
          <h2 id="dialog-title" className="text-lg font-semibold text-(--text)">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xl leading-none text-(--text-muted) transition-colors hover:bg-(--clr) hover:text-(--text)"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        {children}
      </dialog>
    );
  }
);

Dialog.displayName = "Dialog";
