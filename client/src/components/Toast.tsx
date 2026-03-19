import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastItemProps = {
  toast: ToastMessage;
  onRemove: (id: string) => void;
};

const toastStyles: Record<ToastType, string> = {
  success: "border-accent-green/30 bg-accent-green/10 text-accent-green",
  error: "border-accent-red/30 bg-accent-red/10 text-accent-red",
  warning: "border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow",
  info: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue",
};

const toastIcons: Record<ToastType, string> = {
  success: "✓",
  error: "✗",
  warning: "⚠",
  info: "ℹ",
};

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-lg border
        font-mono text-sm transition-all duration-300
        ${toastStyles[toast.type]}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <span className="font-bold shrink-0">{toastIcons[toast.type]}</span>
      <span className="leading-relaxed">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

type ToastContainerProps = {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
};

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};