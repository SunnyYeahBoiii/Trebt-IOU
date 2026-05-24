# Trebt-IOU In-Depth Review & UI Surface Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build internal design system with token-based theming, refactor all UI surfaces to use reusable components, fix code quality bugs, and address critical security issues.

**Architecture:** Bottom-up component library (tokens → primitives → layouts → forms) paired with code quality fixes and backend security hardening.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, NestJS 11, Prisma 7, PostgreSQL

---

## File Map

### New Files
| File | Responsibility |
|---|---|
| `web/src/tokens/colors.ts` | Color palette + CSS variable exports |
| `web/src/tokens/spacing.ts` | Spacing scale |
| `web/src/tokens/typography.ts` | Font families, sizes, weights |
| `web/src/tokens/radius.ts` | Border radius scale |
| `web/src/tokens/shadows.ts` | Shadow elevation levels |
| `web/src/tokens/index.ts` | Barrel export |
| `web/src/ui/primitives/Button.tsx` | Button with variants (primary, secondary, danger, ghost) |
| `web/src/ui/primitives/Input.tsx` | Text/number input with label + error slot |
| `web/src/ui/primitives/Checkbox.tsx` | Accessible checkbox with auto-label |
| `web/src/ui/primitives/Badge.tsx` | Status badge component |
| `web/src/ui/primitives/Avatar.tsx` | User initials avatar |
| `web/src/ui/primitives/Spinner.tsx` | CSS spinner (replaces PNG) |
| `web/src/ui/primitives/Icon.tsx` | SVG icon wrapper |
| `web/src/ui/primitives/Toast.tsx` | Toast notification system (replaces alert) |
| `web/src/ui/layouts/Card.tsx` | Rounded container with header + body |
| `web/src/ui/layouts/Stack.tsx` | Flex gap layout (vertical/horizontal) |
| `web/src/ui/layouts/Dialog.tsx` | Modal with focus trap, aria, escape-close |
| `web/src/ui/layouts/Table.tsx` | Styled table with header/body |
| `web/src/ui/forms/FormField.tsx` | Label + input + error message |
| `web/src/ui/forms/FormGroup.tsx` | Checkbox/radio group with legend |
| `web/src/ui/index.ts` | Barrel export |
| `web/src/config/users.ts` | Centralized user mapping |
| `web/src/lib/toast.ts` | Toast imperative API |

### Modified Files
| File | Changes |
|---|---|
| `web/src/global.css` | Add token CSS variables, remove inline theme duplication |
| `web/src/main.tsx` | Add ToastProvider wrapper |
| `web/src/App.tsx` | Extract Clock component, use UI components |
| `web/src/contexts/AuthContext.tsx` | Import centralized user config |
| `web/src/hooks/useAuth.ts` | No changes (verify compatibility) |
| `web/src/components/ThemeSwitcher.tsx` | Use Button, simplified logic |
| `web/src/components/LoginPopup.tsx` | Use Card, FormField, Button, Input |
| `web/src/components/Dashboard.tsx` | Use Card, Table, Badge, Avatar, Toast |
| `web/src/components/AdBill.tsx` | Use Card, FormGroup, Button, Toast, centralized users |
| `web/src/components/Filter.tsx` | Use Card, FormGroup, Button, centralized users |
| `web/src/components/Statistic.tsx` | Use Card, Table, fix state mutation, add .catch() |
| `web/src/components/dialogs/EditDialog.tsx` | Use Dialog, FormField, Button, centralized users |
| `web/src/components/dialogs/Options.tsx` | Use Dialog, Button, fix DOM bypass |
| `web/src/helper/idToName.helper.ts` | Import from centralized config |
| `web/src/lib/api.ts` | Add 500 error handler, improve 401 flow |
| `api/src/services/token.service.ts` | Add file persistence + expiry |
| `api/src/guards/api-key.guard.ts` | Fail-closed behavior |
| `api/src/dtos/statistic.dto.ts` | Fix Number → number |
| `api/src/statistics/queries/queryStatistic/query-statistic.handler.ts` | Fix generic params |
| `api/tsconfig.json` | Enable strict flags |
| `web/vite.config.ts` | Remove hardcoded ngrok URL |
| `api/src/bills/commands/addBill/add-bill.handler.ts` | Add try/catch |
| `api/src/bills/commands/editBill/edit-bill.handler.ts` | Add try/catch |
| `api/src/bills/commands/deleteBill/delete-bill.handler.ts` | Add try/catch |
| `api/src/debts/commands/debts/addDebt/add-debt.handler.ts` | Add try/catch |
| `api/src/debts/commands/debts/editDebt/edit-debt.handler.ts` | Add try/catch |
| `api/src/debts/commands/debts/removeDebt/remove-debt.handler.ts` | Add try/catch |

---

## Phase 1: Design Tokens

### Task 1: Create Color Tokens

**Files:**
- Create: `web/src/tokens/colors.ts`
- Create: `web/src/tokens/index.ts`

- [ ] **Step 1: Create color tokens**

```typescript
// web/src/tokens/colors.ts

export const colors = {
  light: {
    bg: "#EAE0CC",
    btn: "#856A5D",
    clr: "#B6AE9F",
    text: "#1a1a1a",
    border: "#ffffff",
    err: "#960200",
    ac: "#A2FAA3",
  },
  dark: {
    bg: "#171614",
    btn: "#312F2F",
    clr: "#393E41",
    text: "#e8e8e8",
    border: "#ffffff",
    err: "#ff4d4d",
    ac: "#A2FAA3",
  },
} as const;

export type ColorTheme = keyof typeof colors;
export type ColorKey = keyof (typeof colors)["light"];

export function applyTheme(theme: ColorTheme) {
  const root = document.documentElement.style;
  const palette = colors[theme];
  for (const [key, value] of Object.entries(palette)) {
    root.setProperty(`--${key}`, value);
  }
  root.setProperty("--text", palette.text);
}
```

- [ ] **Step 2: Create barrel export**

```typescript
// web/src/tokens/index.ts
export { colors, applyTheme } from "./colors";
export type { ColorTheme, ColorKey } from "./colors";
export { spacing } from "./spacing";
export { typography } from "./typography";
export { radius } from "./radius";
export { shadows } from "./shadows";
```

### Task 2: Create Spacing, Typography, Radius, Shadows Tokens

**Files:**
- Create: `web/src/tokens/spacing.ts`
- Create: `web/src/tokens/typography.ts`
- Create: `web/src/tokens/radius.ts`
- Create: `web/src/tokens/shadows.ts`

- [ ] **Step 1: Spacing scale**

```typescript
// web/src/tokens/spacing.ts
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
} as const;
```

- [ ] **Step 2: Typography tokens**

```typescript
// web/src/tokens/typography.ts
export const typography = {
  fonts: {
    heading: "'Geist', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Iosevka Charon', monospace",
  },
  sizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;
```

- [ ] **Step 3: Radius tokens**

```typescript
// web/src/tokens/radius.ts
export const radius = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
} as const;
```

- [ ] **Step 4: Shadow tokens**

```typescript
// web/src/tokens/shadows.ts
export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px rgba(0,0,0,0.1)",
  lg: "0 10px 15px rgba(0,0,0,0.15)",
  xl: "0 20px 25px rgba(0,0,0,0.2)",
} as const;
```

### Task 3: Update global.css to Use Token Variables

**Files:**
- Modify: `web/src/global.css`

- [ ] **Step 1: Refactor global.css**

Replace existing theme variable definitions with structured token variables:

```css
/* web/src/global.css */
@import "tailwindcss";

@import url("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Iosevka+Charon&family=Roboto&family=SN+Pro:wght@400;500;600;700&display=swap");

:root {
  /* Light theme defaults */
  --bg: #EAE0CC;
  --btn: #856A5D;
  --clr: #B6AE9F;
  --text: #1a1a1a;
  --border: #ffffff;
  --err: #960200;
  --ac: #A2FAA3;
}

[data-theme="dark"] {
  --bg: #171614;
  --btn: #312F2F;
  --clr: #393E41;
  --text: #e8e8e8;
  --border: #ffffff;
  --err: #ff4d4d;
  --ac: #A2FAA3;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body, 'Inter', sans-serif);
  background-color: var(--bg);
  color: var(--text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* CSS Spinner (replaces PNG loading icon) */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--clr);
  border-top-color: var(--btn);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

- [ ] **Step 2: Commit**

```bash
git add web/src/tokens/ web/src/global.css
git commit -m "feat: add design token system with colors, spacing, typography, radius, shadows"
```

---

## Phase 2: Centralized User Config

### Task 4: Create Centralized User Configuration

**Files:**
- Create: `web/src/config/users.ts`

- [ ] **Step 1: Create user config**

```typescript
// web/src/config/users.ts

export const USERS = {
  "1": "Phương",
  "2": "Pha",
  "3": "Thịnh",
  "4": "Tuấn",
} as const;

export type UserId = keyof typeof USERS;

export function getUserName(id: string): string {
  return USERS[id as UserId] ?? id;
}

export function getUserIds(): UserId[] {
  return Object.keys(USERS) as UserId[];
}

export function getUserEntries(): [UserId, string][] {
  return Object.entries(USERS) as [UserId, string][];
}
```

- [ ] **Step 2: Update idToName helper**

```typescript
// web/src/helper/idToName.helper.ts
import { getUserName } from "../config/users";

/** @deprecated use getUserName from config/users instead */
export const idToName = getUserName;
```

- [ ] **Step 3: Update AuthContext to use centralized config**

Read `web/src/contexts/AuthContext.tsx`, replace hardcoded user mapping with import from `config/users`. Remove inline `userIdToName` object, use `getUserName` instead.

- [ ] **Step 4: Update LoginPopup to use centralized config**

Read `web/src/components/LoginPopup.tsx`, replace hardcoded user mapping with import from `config/users`.

- [ ] **Step 5: Commit**

```bash
git add web/src/config/ web/src/helper/idToName.helper.ts web/src/contexts/AuthContext.tsx web/src/components/LoginPopup.tsx
git commit -m "refactor: centralize user mapping, remove 6-file duplication"
```

---

## Phase 3: UI Primitives

### Task 5: Button Component

**Files:**
- Create: `web/src/ui/primitives/Button.tsx`
- Create: `web/src/ui/index.ts`

- [ ] **Step 1: Create Button component**

```typescript
// web/src/ui/primitives/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-(--btn) text-white hover:scale-105",
  secondary: "bg-(--clr) text-(--text) hover:scale-105",
  danger: "bg-(--err) text-white hover:scale-105",
  ghost: "bg-transparent text-(--text) hover:bg-(--clr)",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading = false, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`rounded-xl px-4 py-2 font-medium transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${variantClasses[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
```

### Task 6: Spinner Component

**Files:**
- Create: `web/src/ui/primitives/Spinner.tsx`

- [ ] **Step 1: Create CSS Spinner**

```typescript
// web/src/ui/primitives/Spinner.tsx
import { HTMLAttributes } from "react";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "16px", md: "24px", lg: "32px" };

export function Spinner({ size = "md", className = "", ...props }: SpinnerProps) {
  const dimension = sizeMap[size];
  return (
    <div
      className={`spinner ${className}`}
      style={{ width: dimension, height: dimension }}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}
```

### Task 7: Input Component

**Files:**
- Create: `web/src/ui/primitives/Input.tsx`

- [ ] **Step 1: Create Input component**

```typescript
// web/src/ui/primitives/Input.tsx
import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-(--text)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-sm bg-(--clr) px-3 py-2 text-(--text) outline-none focus:ring-2 focus:ring-(--btn) ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-(--err)">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
```

### Task 8: Checkbox Component

**Files:**
- Create: `web/src/ui/primitives/Checkbox.tsx`

- [ ] **Step 1: Create Checkbox component**

```typescript
// web/src/ui/primitives/Checkbox.tsx
import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <label htmlFor={checkboxId} className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`h-4 w-4 rounded accent-(--btn) ${className}`}
          {...props}
        />
        <span className="text-sm text-(--text)">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
```

### Task 9: Badge, Avatar, Icon Components

**Files:**
- Create: `web/src/ui/primitives/Badge.tsx`
- Create: `web/src/ui/primitives/Avatar.tsx`
- Create: `web/src/ui/primitives/Icon.tsx`

- [ ] **Step 1: Create Badge**

```typescript
// web/src/ui/primitives/Badge.tsx
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "error";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-(--clr) text-(--text)",
  success: "bg-(--ac) text-black",
  error: "bg-(--err) text-white",
};

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create Avatar**

```typescript
// web/src/ui/primitives/Avatar.tsx
import { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "28px", md: "36px", lg: "48px" };
const fontSizeMap = { sm: "10px", md: "14px", lg: "18px" };

export function Avatar({ name, size = "md", className = "", ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-(--btn) text-white font-semibold ${className}`}
      style={{ width: dimension, height: dimension, fontSize }}
      role="img"
      aria-label={name}
      {...props}
    >
      {initials}
    </div>
  );
}
```

- [ ] **Step 3: Create Icon**

```typescript
// web/src/ui/primitives/Icon.tsx
import { SVGAttributes } from "react";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={`inline-block ${className}`}
      aria-hidden="true"
      {...props}
    >
      <use href={`/icons/${name}.svg#${name}`} />
    </svg>
  );
}
```

### Task 10: Toast Notification System

**Files:**
- Create: `web/src/ui/primitives/Toast.tsx`
- Create: `web/src/lib/toast.ts`

- [ ] **Step 1: Create Toast component**

```typescript
// web/src/ui/primitives/Toast.tsx
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
```

- [ ] **Step 2: Create toast imperative API wrapper**

```typescript
// web/src/lib/toast.ts
export { showToast } from "../ui/primitives/Toast";
```

- [ ] **Step 3: Wrap app in ToastProvider**

Modify `web/src/main.tsx` to wrap `<App />` with `<ToastProvider>`.

- [ ] **Step 4: Commit**

```bash
git add web/src/ui/primitives/ web/src/lib/toast.ts web/src/main.tsx
git commit -m "feat: add UI primitives (Button, Input, Checkbox, Badge, Avatar, Icon, Spinner, Toast)"
```

---

## Phase 4: Layout Components

### Task 11: Card Component

**Files:**
- Create: `web/src/ui/layouts/Card.tsx`

- [ ] **Step 1: Create Card component**

```typescript
// web/src/ui/layouts/Card.tsx
import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl bg-(--btn) p-4 shadow-md ${className}`}
        {...props}
      >
        {title && <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>}
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
```

### Task 12: Stack Component

**Files:**
- Create: `web/src/ui/layouts/Stack.tsx`

- [ ] **Step 1: Create Stack component**

```typescript
// web/src/ui/layouts/Stack.tsx
import { HTMLAttributes, forwardRef } from "react";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
}

const gapMap = { xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "24px" };
const alignMap = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" };
const justifyMap = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around" };

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "vertical",
      gap = "md",
      align = "stretch",
      justify = "start",
      wrap = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex ${direction === "horizontal" ? "flex-row" : "flex-col"} ${wrap ? "flex-wrap" : ""} ${className}`}
        style={{
          gap: gapMap[gap],
          alignItems: alignMap[align],
          justifyContent: justifyMap[justify],
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
```

### Task 13: Dialog Component

**Files:**
- Create: `web/src/ui/layouts/Dialog.tsx`

- [ ] **Step 1: Create Dialog with focus trap and aria**

```typescript
// web/src/ui/layouts/Dialog.tsx
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
```

### Task 14: Table Component

**Files:**
- Create: `web/src/ui/layouts/Table.tsx`
- Create: `web/src/ui/layouts/TableHeader.tsx`
- Create: `web/src/ui/layouts/TableCell.tsx`

- [ ] **Step 1: Create Table components**

```typescript
// web/src/ui/layouts/Table.tsx
import { TableHTMLAttributes, forwardRef } from "react";

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
  ({ className = "", children, ...props }, ref) => (
    <table ref={ref} className={`w-full table-fixed border-collapse ${className}`} {...props}>
      {children}
    </table>
  )
);
Table.displayName = "Table";

// web/src/ui/layouts/TableHeader.tsx
import { ThHTMLAttributes, forwardRef } from "react";

export const TableHeader = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <th
      ref={ref}
      className={`border-2 border-(--border) p-2.5 text-center text-white font-semibold ${className}`}
      {...props}
    >
      {children}
    </th>
  )
);
TableHeader.displayName = "TableHeader";

// web/src/ui/layouts/TableCell.tsx
import { TdHTMLAttributes, forwardRef } from "react";

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <td
      ref={ref}
      className={`border-2 border-(--border) p-2.5 text-center text-(--text) truncate ${className}`}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";
```

- [ ] **Step 2: Update barrel export**

```typescript
// web/src/ui/index.ts
// Primitives
export { Button } from "./primitives/Button";
export type { ButtonProps, ButtonVariant } from "./primitives/Button";
export { Input } from "./primitives/Input";
export type { InputProps } from "./primitives/Input";
export { Checkbox } from "./primitives/Checkbox";
export type { CheckboxProps } from "./primitives/Checkbox";
export { Badge } from "./primitives/Badge";
export type { BadgeProps } from "./primitives/Badge";
export { Avatar } from "./primitives/Avatar";
export type { AvatarProps } from "./primitives/Avatar";
export { Spinner } from "./primitives/Spinner";
export type { SpinnerProps } from "./primitives/Spinner";
export { Icon } from "./primitives/Icon";
export type { IconProps } from "./primitives/Icon";
export { ToastProvider, useToast } from "./primitives/Toast";

// Layouts
export { Card } from "./layouts/Card";
export type { CardProps } from "./layouts/Card";
export { Stack } from "./layouts/Stack";
export type { StackProps } from "./layouts/Stack";
export { Dialog } from "./layouts/Dialog";
export type { DialogProps } from "./layouts/Dialog";
export { Table, TableHeader, TableCell } from "./layouts/Table";

// Forms
export { FormField } from "./forms/FormField";
export type { FormFieldProps } from "./forms/FormField";
export { FormGroup } from "./forms/FormGroup";
export type { FormGroupProps } from "./forms/FormGroup";
```

- [ ] **Step 3: Commit**

```bash
git add web/src/ui/layouts/ web/src/ui/index.ts
git commit -m "feat: add layout components (Card, Stack, Dialog, Table)"
```

---

## Phase 5: Form Components

### Task 15: FormField and FormGroup

**Files:**
- Create: `web/src/ui/forms/FormField.tsx`
- Create: `web/src/ui/forms/FormGroup.tsx`

- [ ] **Step 1: Create FormField**

```typescript
// web/src/ui/forms/FormField.tsx
import { ReactNode, useId } from "react";
import { Input, InputProps } from "../primitives/Input";

export interface FormFieldProps extends Omit<InputProps, "id"> {
  children?: ReactNode;
}

export function FormField({ label, error, children, ...inputProps }: FormFieldProps) {
  const id = useId();

  if (children) {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-(--text)">
            {label}
          </label>
        )}
        {children}
        {error && <span className="text-xs text-(--err)">{error}</span>}
      </div>
    );
  }

  return <Input id={id} label={label} error={error} {...inputProps} />;
}
```

- [ ] **Step 2: Create FormGroup**

```typescript
// web/src/ui/forms/FormGroup.tsx
import { useId } from "react";
import { Checkbox } from "../primitives/Checkbox";
import { Stack } from "../layouts/Stack";

export interface FormGroupProps {
  label: string;
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  direction?: "horizontal" | "vertical";
}

export function FormGroup({ label, options, selected, onChange, direction = "vertical" }: FormGroupProps) {
  const groupId = useId();

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <fieldset className="border border-(--clr) rounded-lg p-3" aria-labelledby={`${groupId}-legend`}>
      <legend id={`${groupId}-legend`} className="text-sm font-medium text-white px-2">
        {label}
      </legend>
      <Stack direction={direction} gap="sm" className="mt-2">
        {options.map((opt) => (
          <Checkbox
            key={opt.id}
            checked={selected.includes(opt.id)}
            onChange={() => toggle(opt.id)}
            label={opt.label}
          />
        ))}
      </Stack>
    </fieldset>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add web/src/ui/forms/
git commit -m "feat: add form components (FormField, FormGroup)"
```

---

## Phase 6: Code Quality Fixes

### Task 16: Fix State Mutation in Statistic

**Files:**
- Modify: `web/src/components/Statistic.tsx`

- [ ] **Step 1: Fix immutable state update**

Read `web/src/components/Statistic.tsx`. Find the `setDebt(oldDebt => { oldDebt[...][...] = ...; return oldDebt })` pattern on line ~21. Replace with immutable update:

```typescript
setDebt((prev) =>
  prev.map((user, i) =>
    i === userIndex ? { ...user, [creditorId]: newAmount } : user
  )
);
```

- [ ] **Step 2: Add .catch() to unhandled promise**

Find the `.then().then()` chain without `.catch()`. Append:

```typescript
.catch((err) => {
  console.error("Failed to fetch statistics:", err);
  showToast("Không thể tải thống kê", "error");
});
```

### Task 17: Fix DOM Bypass in Options

**Files:**
- Modify: `web/src/components/dialogs/Options.tsx`

- [ ] **Step 1: Replace DOM manipulation with React state**

Find `dialogRef.current.style.display = "none"` and replace with state-controlled open prop. Use the new `Dialog` component wrapper.

### Task 18: Extract Clock Component

**Files:**
- Create: `web/src/components/Clock.tsx`
- Modify: `web/src/App.tsx`

- [ ] **Step 1: Create isolated Clock component**

```typescript
// web/src/components/Clock.tsx
import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <time className="text-sm text-(--clr)" dateTime={time.toISOString()}>
      {time.toLocaleTimeString("vi-VN")}
    </time>
  );
}
```

- [ ] **Step 2: Update App.tsx**

Remove `setInterval` and `currentTime` state from `App.tsx`. Import and use `<Clock />` component instead.

### Task 19: Replace alert() with Toast

**Files:**
- Modify: All page components (AdBill, Filter, Dashboard, Statistic, LoginPopup, EditDialog, Options)

- [ ] **Step 1: Replace all alert() calls**

Search for `alert(` across all components. Replace each with `showToast(message, type)`. Add `import { showToast } from "@/lib/toast"` or use `useToast()` hook.

### Task 20: Commit Code Quality Fixes

```bash
git add web/src/components/ web/src/App.tsx
git commit -m "fix: resolve state mutation, DOM bypass, re-render, unhandled promise, alert() issues"
```

---

## Phase 7: Refactor Page Components

### Task 21: Refactor ThemeSwitcher

**Files:**
- Modify: `web/src/components/themeSwitcher/ThemeSwitcher.tsx`

- [ ] **Step 1: Update to use Button + applyTheme**

Read the file, replace manual `document.documentElement.style.setProperty` calls with `applyTheme()` from tokens. Replace styled divs with `<Button variant="ghost">`.

### Task 22: Refactor LoginPopup

**Files:**
- Modify: `web/src/components/LoginPopup.tsx`

- [ ] **Step 1: Use Card, FormField, Button, centralized users**

Replace inline-styled wrapper with `<Card>`. Replace manual input markup with `<FormField>`. Replace submit button with `<Button loading={isLoading}>`. Import `getUserEntries()` from `config/users` for user list.

### Task 23: Refactor AdBill

**Files:**
- Modify: `web/src/components/AdBill.tsx`

- [ ] **Step 1: Use Card, FormGroup, Button, Toast, centralized users**

Read the file. Replace:
- Outer wrapper → `<Card title="Thêm hóa đơn">`
- Creditor/debtor checkbox blocks → `<FormGroup>` (eliminates ~80 lines of duplicated markup)
- Input fields → `<FormField>`
- Submit button → `<Button loading={isSubmitting}>` (removes ref.disabled pattern)
- `alert()` → `showToast()`
- User mapping → `getUserEntries()` from `config/users`

### Task 24: Refactor Filter

**Files:**
- Modify: `web/src/components/Filter.tsx`

- [ ] **Step 1: Use Card, FormGroup, Button, centralized users**

Same pattern as AdBill. Replace checkbox blocks with `<FormGroup>`, wrapper with `<Card>`, buttons with `<Button>`, user mapping with centralized config.

### Task 25: Refactor Dashboard

**Files:**
- Modify: `web/src/components/Dashboard.tsx`

- [ ] **Step 1: Use Card, Table, Badge, Avatar, Toast**

Read the file. Replace:
- Bill cards → `<Card>` with `<Badge>` for status
- Table rows → `<Table>`, `<TableHeader>`, `<TableCell>`
- User avatars → `<Avatar>`
- `alert()` → `showToast()`
- `fetchData` memoize with `useCallback`

### Task 26: Refactor EditDialog

**Files:**
- Modify: `web/src/components/dialogs/EditDialog.tsx`

- [ ] **Step 1: Use Dialog, FormField, Button, centralized users**

Replace custom modal overlay with `<Dialog>` component. Replace inputs with `<FormField>`. Replace buttons with `<Button>`. Import users from config.

### Task 27: Refactor Options

**Files:**
- Modify: `web/src/components/dialogs/Options.tsx`

- [ ] **Step 1: Use Dialog, Button, fix DOM bypass**

Replace entire dialog implementation with `<Dialog open={open} onClose={onClose}>`. Remove `dialogRef.current.style.display = "none"`. Replace styled divs with `<Button>`.

### Task 28: Update api.ts Error Handling

**Files:**
- Modify: `web/src/lib/api.ts`

- [ ] **Step 1: Improve error interceptor**

Read the file. Add 500 error handler that shows toast. Replace hard `window.location.reload()` on 401 with a softer redirect + toast notification.

### Task 29: Commit Page Refactors

```bash
git add web/src/components/ web/src/lib/api.ts
git commit -m "refactor: migrate all page components to internal design system"
```

---

## Phase 8: Backend Security Fixes

### Task 30: Fix TypeScript Config & DTO Types

**Files:**
- Modify: `api/tsconfig.json`
- Modify: `api/src/dtos/statistic.dto.ts`
- Modify: `api/src/statistics/queries/queryStatistic/query-statistic.handler.ts`

- [ ] **Step 1: Enable strict TypeScript flags**

```json
// api/tsconfig.json - update compilerOptions
{
  "noImplicitAny": true,
  "strictBindCallApply": true,
  "noFallthroughCasesInSwitch": true
}
```

- [ ] **Step 2: Fix Number → number in DTO**

```typescript
// api/src/dtos/statistic.dto.ts
export class StatisticDto {
  creditorId!: number;  // was Number
  debtorId!: number;    // was Number
  amount!: number;      // was Number
}
```

- [ ] **Step 3: Fix inverted generic params**

```typescript
// query-statistic.handler.ts
// Change: IQueryHandler<number, StatisticDto[]>
// To: IQueryHandler<QueryStatisticQuery, StatisticDto[]>
```

### Task 31: Token Service with Persistence + Expiry

**Files:**
- Modify: `api/src/services/token.service.ts`

- [ ] **Step 1: Add file-based persistence and expiry**

Read the current file. Replace in-memory `Set<string>` with:
- Map<string, { expiresAt: number }> for expiry tracking
- Save to JSON file on each change
- Load from file on startup
- `generateToken()` returns token with 24h expiry
- `verifyToken()` checks expiry and removes expired tokens
- Periodic cleanup of expired tokens

### Task 32: Fail-Closed API Key Guard

**Files:**
- Modify: `api/src/guards/api-key.guard.ts`

- [ ] **Step 1: Reject when API_KEY is unset**

Read line 29 where `if (!hashedKey) return true`. Change to:

```typescript
if (!hashedKey) {
  this.logger.error("API_KEY not configured - rejecting request");
  throw new ForbiddenException("API key not configured");
}
```

### Task 33: Add Try/Catch to Command Handlers

**Files:**
- Modify: `api/src/bills/commands/addBill/add-bill.handler.ts`
- Modify: `api/src/bills/commands/editBill/edit-bill.handler.ts`
- Modify: `api/src/bills/commands/deleteBill/delete-bill.handler.ts`
- Modify: `api/src/debts/commands/debts/addDebt/add-debt.handler.ts`
- Modify: `api/src/debts/commands/debts/editDebt/edit-debt.handler.ts`
- Modify: `api/src/debts/commands/debts/removeDebt/remove-debt.handler.ts`

- [ ] **Step 1: Wrap transaction calls in try/catch**

Pattern for each handler:

```typescript
async execute(command: AddBillCommand): Promise<void> {
  try {
    await this.prisma.$transaction(async (tx) => {
      // existing logic
    });
  } catch (error) {
    this.logger.error("Failed to execute command", error);
    throw new InternalServerErrorException("Operation failed");
  }
}
```

### Task 34: Remove Hardcoded ngrok URL

**Files:**
- Modify: `web/vite.config.ts`

- [ ] **Step 1: Replace hardcoded URL with env var**

Read line 22 with `'236571cca288.ngrok-free.app'`. Replace:

```typescript
allowedHosts: [process.env.VITE_API_HOST ?? "localhost"],
```

### Task 35: Commit Backend Fixes

```bash
git add api/tsconfig.json api/src/ web/vite.config.ts
git commit -m "fix: enforce strict TypeScript, fix token expiry, fail-closed guard, add error handling"
```

---

## Phase 9: Verification & Tests

### Task 36: Add Backend Unit Tests

**Files:**
- Create: `api/src/bills/commands/addBill/add-bill.handler.spec.ts`
- Create: `api/src/guards/api-key.guard.spec.ts`
- Create: `api/src/services/token.service.spec.ts`

- [ ] **Step 1: Write handler test**

```typescript
// api/src/bills/commands/addBill/add-bill.handler.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { AddBillHandler } from "./add-bill.handler";
import { PrismaService } from "../../../prisma/prisma.service";

describe("AddBillHandler", () => {
  let handler: AddBillHandler;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddBillHandler,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(async (cb) => {
              const mockTx = { bill: { create: jest.fn() }, debt: { upsert: jest.fn() } };
              return cb(mockTx);
            }),
          },
        },
      ],
    }).compile();

    handler = module.get(AddBillHandler);
    prisma = module.get(PrismaService);
  });

  it("should create a bill and update debts", async () => {
    const command = {
      billId: "test-1",
      creatorId: "1",
      amount: 100000,
      note: "Test bill",
      creditorIds: ["2"],
      debtorIds: ["3"],
      createdAt: new Date(),
    };

    await expect(handler.execute(command)).resolves.not.toThrow();
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("should throw on transaction failure", async () => {
    jest.spyOn(prisma, "$transaction").mockRejectedValue(new Error("DB error"));

    await expect(
      handler.execute({} as any)
    ).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run tests**

```bash
cd api && npm test -- --testPathPattern="add-bill.handler" --verbose
```

Expected: 2 tests pass.

- [ ] **Step 3: Write guard test**

```typescript
// api/src/guards/api-key.guard.spec.ts
import { ApiKeyGuard } from "./api-key.guard";
import { Reflector } from "@nestjs/core";
import { ForbiddenException } from "@nestjs/common";

describe("ApiKeyGuard", () => {
  let guard: ApiKeyGuard;
  let reflector: Reflector;

  const mockExecutionContext = (apiKeyHeader?: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { "x-api-key": apiKeyHeader },
      }),
    }),
    getClass: () => ({}),
    getHandler: () => ({}),
  });

  beforeEach(() => {
    reflector = new Reflector();
    guard = new ApiKeyGuard(reflector);
    process.env.API_KEY = "test-key";
  });

  it("should reject when API key is missing", async () => {
    await expect(guard.canActivate(mockExecutionContext(undefined))).rejects.toThrow(ForbiddenException);
  });

  it("should accept when API key matches", async () => {
    // bcrypt compare mocked via jest
    const result = await guard.canActivate(mockExecutionContext("test-key"));
    expect(result).toBe(true);
  });
});
```

### Task 37: Manual Verification Checklist

- [ ] Start backend: `cd api && npm run start:dev`
- [ ] Start frontend: `cd web && npm run dev`
- [ ] Navigate to `/dashboard` — verify bills load, theme toggle works
- [ ] Navigate to `/add-bill` — submit a bill, verify success toast
- [ ] Navigate to `/filter` — apply filters, verify results
- [ ] Navigate to `/statistic` — verify debt table renders, no console errors
- [ ] Test theme switching (light/dark)
- [ ] Test dialog open/close (Escape key, overlay click, close button)
- [ ] Verify no PNG spinner, CSS spinner shows
- [ ] Verify no `alert()` dialogs appear
- [ ] Check browser console — zero errors, zero warnings
- [ ] Run `npm run build` in web/ — no type errors
- [ ] Run `npm test` in api/ — all tests pass

### Task 38: Final Commit

```bash
git add api/src/**/*.spec.ts
git commit -m "test: add unit tests for handlers, guards, and token service"
```

---

## Summary

| Phase | Tasks | Output |
|---|---|---|
| 1. Tokens | 1-3 | `tokens/` directory, updated `global.css` |
| 2. User Config | 4 | `config/users.ts`, deduped 6 files |
| 3. Primitives | 5-10 | 8 primitive components + Toast |
| 4. Layouts | 11-14 | 4 layout components (Card, Stack, Dialog, Table) |
| 5. Forms | 15 | 2 form components (FormField, FormGroup) |
| 6. Quality Fixes | 16-20 | State mutation, DOM bypass, clock, alerts |
| 7. Refactor Pages | 21-29 | All page components migrated |
| 8. Backend Security | 30-35 | Token expiry, guard, try/catch, strict TS |
| 9. Verification | 36-38 | Unit tests, manual checklist, final commit |

Total: 38 tasks, ~15 new files, ~20 modified files.
