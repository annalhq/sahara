"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      closeButton
      theme={theme as "light" | "dark" | undefined}
      className="toaster-override"
      toastOptions={{
        classNames: {
          success:
            "group toast toast-success bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30",
          error:
            "group toast toast-error bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30",
          info: "group toast toast-info bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30",
          warning:
            "group toast toast-warning bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-900/30",
          loading:
            "group toast toast-loading bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-900/30",
        },
      }}
    />
  );
}
