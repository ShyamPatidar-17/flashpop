import * as React from 'react';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastTheme = 'light' | 'dark' | 'colored';

export interface ToastAction {
  label: string;
  onClick: (id: string) => void;
  dismissOnClick?: boolean;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: React.ReactNode;
  duration?: number | false;
  showProgressBar?: boolean;
  pauseOnHover?: boolean;
  closeButton?: boolean;
  icon?: React.ReactNode | false;
  action?: ToastAction;
  position?: ToastPosition;
  theme?: ToastTheme;
  className?: string;
  style?: React.CSSProperties;
  onClose?: (id: string) => void;
  swipeable?: boolean;
  swipeThreshold?: number;
  onAccept?: (id: string) => void;
  onCancel?: (id: string) => void;
  acceptLabel?: string;
  cancelLabel?: string;
}

export interface ToastItemProps extends ToastOptions {
  id: string;
  message: React.ReactNode;
  onDismiss: (id: string) => void;
}

export interface ToastContainerProps {
  toasts?: ToastItemProps[];
  onDismiss?: (id: string) => void;
  position?: ToastPosition;
  theme?: ToastTheme;
  newestOnTop?: boolean;
  pauseOnHover?: boolean;
  showProgressBar?: boolean;
  swipeable?: boolean;
  swipeThreshold?: number;
  limit?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  autoClose?: number | false;
  pauseOnHover?: boolean;
  showProgressBar?: boolean;
  swipeable?: boolean;
  swipeThreshold?: number;
  theme?: ToastTheme;
  limit?: number;
  newestOnTop?: boolean;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

export interface ToastPromiseOptions {
  loading?: React.ReactNode;
  success?: React.ReactNode | ((data: any) => React.ReactNode);
  error?: React.ReactNode | ((err: any) => React.ReactNode);
}

export interface ToastPromiseExtraOptions {
  duration?: number;
  showProgressBar?: boolean;
  successOptions?: Partial<ToastOptions>;
  errorOptions?: Partial<ToastOptions>;
}

export interface ToastMethods {
  (message: React.ReactNode, options?: ToastOptions): string;
  success: (message: React.ReactNode, options?: ToastOptions) => string;
  error: (message: React.ReactNode, options?: ToastOptions) => string;
  warning: (message: React.ReactNode, options?: ToastOptions) => string;
  info: (message: React.ReactNode, options?: ToastOptions) => string;
  loading: (message: React.ReactNode, options?: ToastOptions) => string;
  promise: <T>(
    promise: Promise<T>,
    messages: ToastPromiseOptions,
    options?: ToastPromiseExtraOptions
  ) => Promise<T>;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, options: Partial<ToastOptions> & { message?: React.ReactNode }) => void;
}

export declare const ToastContext: React.Context<any>;

export declare const ToastProvider: React.FC<ToastProviderProps>;

export declare const ToastContainer: React.FC<ToastContainerProps>;

export declare const ToastItem: React.FC<ToastItemProps>;

export declare const useToast: () => ToastMethods;

export declare const SuccessIcon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
export declare const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
export declare const WarningIcon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
export declare const InfoIcon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
export declare const LoadingIcon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
export declare const CloseIcon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
