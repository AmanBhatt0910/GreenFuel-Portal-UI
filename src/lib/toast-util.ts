import { toast as sonnerToast } from "sonner";
import React from "react";

type ToastMessage = string | React.ReactNode;
type ToastOptions = Record<string, any>;

// Types for promise toast
type PromiseT<Data = any> = Promise<Data> | (() => Promise<Data>);
type PromiseData<ToastData = any> = {
  loading?: ToastMessage;
  success?: ToastMessage | ((data: ToastData) => ToastMessage);
  error?: ToastMessage | ((error: any) => ToastMessage);
  finally?: () => void | Promise<void>;
  [key: string]: any;
};

// Cubia themed toast utilities
export const toast = {
  // Default toast
  message: (message: ToastMessage, options?: ToastOptions) => {
    return sonnerToast(message, {
      ...options,
    });
  },

  // Success toast
  success: (message: ToastMessage, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      ...options,
    });
  },

  // Error toast
  error: (message: ToastMessage, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      ...options,
    });
  },

  // Info toast
  info: (message: ToastMessage, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      ...options,
    });
  },

  // Warning toast
  warning: (message: ToastMessage, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      ...options,
    });
  },

  // Loading toast
  loading: (message: ToastMessage, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      ...options,
    });
  },

  // Promise toast (with Cubia styling)
  promise: <TData = any>(
    promise: PromiseT<TData>, 
    options?: PromiseData<TData>
  ) => {
    return sonnerToast.promise(promise, {
      ...options,
      classNames: {
        ...options?.classNames,
        loadingIcon: "text-[#6552D0]",
        successIcon: "text-[#41a350]",
        errorIcon: "text-[#e74c3c]",
      }
    });
  },

  // Dismiss toast
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  }
};