"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  message?: string;
  duration?: number;
  action?: ToastAction;
}

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  action?: ToastAction;
  duration: number;
}

interface ToastContextType {
  toast: (title: string, options?: ToastOptions & { type?: ToastType }) => void;
  showSuccess: (title: string, message?: string, action?: ToastAction) => void;
  showError: (title: string, message?: string, action?: ToastAction) => void;
  showInfo: (title: string, message?: string, action?: ToastAction) => void;
  showWarning: (title: string, message?: string, action?: ToastAction) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, options?: ToastOptions & { type?: ToastType }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const type: ToastType = options?.type || "success";
      const duration = options?.duration || 3500;

      const newToast: ToastItem = {
        id,
        title,
        message: options?.message,
        type,
        action: options?.action,
        duration,
      };

      // Keep maximum 4 visible toasts at a time
      setToasts((prev) => [newToast, ...prev.slice(0, 3)]);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast],
  );

  const showSuccess = useCallback(
    (title: string, message?: string, action?: ToastAction) => {
      addToast(title, { message, type: "success", action });
    },
    [addToast],
  );

  const showError = useCallback(
    (title: string, message?: string, action?: ToastAction) => {
      addToast(title, { message, type: "error", action });
    },
    [addToast],
  );

  const showInfo = useCallback(
    (title: string, message?: string, action?: ToastAction) => {
      addToast(title, { message, type: "info", action });
    },
    [addToast],
  );

  const showWarning = useCallback(
    (title: string, message?: string, action?: ToastAction) => {
      addToast(title, { message, type: "warning", action });
    },
    [addToast],
  );

  return (
    <ToastContext.Provider
      value={{
        toast: addToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        dismissToast,
      }}
    >
      {children}

      {/* Floating Luxury Toast Container */}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed top-10 right-5 z-[9999] flex flex-col gap-2.5 max-w-[90vw] sm:max-w-md w-full pointer-events-none px-3 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start justify-between gap-3 p-4 bg-[#141416] text-[#FAF9F6] border border-[#8C734B]/40 rounded-sm shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in"
          >
            {/* Status Icon */}
            <div className="shrink-0 pt-0.5">
              {t.type === "success" && (
                <div className="w-6 h-6 rounded-full bg-[#8C734B]/20 text-[#8C734B] flex items-center justify-center border border-[#8C734B]/50">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {t.type === "info" && (
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
              {t.type === "warning" && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              )}
              {t.type === "error" && (
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="text-xs font-semibold tracking-wide uppercase text-[#FAF9F6] font-serif">
                {t.title}
              </h4>
              {t.message && (
                <p className="text-xs text-[#A0A5B1] font-light leading-relaxed break-words">
                  {t.message}
                </p>
              )}
              {t.action && (
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      t.action?.onClick();
                      dismissToast(t.id);
                    }}
                    className="text-[11px] font-semibold text-[#8C734B] hover:text-[#A17840] underline underline-offset-4 tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    {t.action.label} →
                  </button>
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="shrink-0 p-1 text-[#5E6472] hover:text-[#FAF9F6] transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
