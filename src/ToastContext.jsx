import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { ToastContainer } from './ToastContainer';

// Create Toast Context
export const ToastContext = createContext(null);

let toastCount = 0;
const generateId = () => {
  toastCount += 1;
  return `easy-toast-${Date.now()}-${toastCount}`;
};

/**
 * ToastProvider Component
 * Wraps your application to provide toast functionality anywhere in the component tree.
 */
export const ToastProvider = ({
  children,
  position = 'top-right',
  autoClose = 3000,
  pauseOnHover = true,
  showProgressBar = true,
  swipeable = true,
  swipeThreshold = 70,
  theme = 'light',
  limit,
  newestOnTop = false,
  containerClassName = '',
  containerStyle = {},
}) => {
  const [toasts, setToasts] = useState([]);
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;

  // Add a new toast
  const addToast = useCallback(
    (messageOrOptions, maybeOptions = {}) => {
      let options = {};
      if (typeof messageOrOptions === 'object' && !React.isValidElement(messageOrOptions)) {
        options = { ...messageOrOptions };
      } else {
        options = { ...maybeOptions, message: messageOrOptions };
      }

      const id = options.id || generateId();
      const newToast = {
        id,
        type: options.type || 'default',
        message: options.message,
        title: options.title,
        duration: options.duration !== undefined ? options.duration : autoClose,
        showProgressBar: options.showProgressBar !== undefined ? options.showProgressBar : showProgressBar,
        pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : pauseOnHover,
        swipeable: options.swipeable !== undefined ? options.swipeable : swipeable,
        swipeThreshold: options.swipeThreshold !== undefined ? options.swipeThreshold : swipeThreshold,
        closeButton: options.closeButton !== undefined ? options.closeButton : true,
        icon: options.icon,
        action: options.action,
        onClose: options.onClose,
        onAccept: options.onAccept,
        onCancel: options.onCancel,
        acceptLabel: options.acceptLabel,
        cancelLabel: options.cancelLabel,
        position: options.position || position,
        theme: options.theme || theme,
        className: options.className || '',
        style: options.style || {},
      };

      setToasts((prev) => {
        // If updating an existing toast with same id
        const existingIndex = prev.findIndex((t) => t.id === id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...newToast };
          return updated;
        }

        // Apply limit if specified
        if (limit && limit > 0 && prev.length >= limit) {
          return [...prev.slice(prev.length - limit + 1), newToast];
        }

        return [...prev, newToast];
      });

      return id;
    },
    [autoClose, showProgressBar, pauseOnHover, position, theme, limit]
  );

  // Update an existing toast (e.g. for promises)
  const updateToast = useCallback((id, updatedOptions) => {
    setToasts((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            ...updatedOptions,
            id, // preserve id
          };
        }
        return t;
      })
    );
  }, []);

  // Dismiss a specific toast
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Context value with core functions
  const contextValue = useMemo(
    () => ({
      addToast,
      updateToast,
      dismissToast,
      dismissAll,
      toasts,
    }),
    [addToast, updateToast, dismissToast, dismissAll, toasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        position={position}
        theme={theme}
        limit={limit}
        newestOnTop={newestOnTop}
        pauseOnHover={pauseOnHover}
        showProgressBar={showProgressBar}
        swipeable={swipeable}
        swipeThreshold={swipeThreshold}
        className={containerClassName}
        style={containerStyle}
      />
    </ToastContext.Provider>
  );
};

/**
 * Custom Hook: useToast
 * Exposes an intuitive API to trigger and manage toast notifications.
 *
 * Example:
 * const toast = useToast();
 * toast.success('Profile updated!');
 * toast.error('Something went wrong');
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>. Please wrap your root component in <ToastProvider>.');
  }

  const { addToast, updateToast, dismissToast, dismissAll } = context;

  // Base callable toast function
  const toast = useCallback(
    (message, options) => {
      return addToast(message, options);
    },
    [addToast]
  );

  // Helper: toast.success
  toast.success = useCallback(
    (message, options = {}) => {
      return addToast(message, { ...options, type: 'success' });
    },
    [addToast]
  );

  // Helper: toast.error
  toast.error = useCallback(
    (message, options = {}) => {
      return addToast(message, { ...options, type: 'error' });
    },
    [addToast]
  );

  // Helper: toast.warning
  toast.warning = useCallback(
    (message, options = {}) => {
      return addToast(message, { ...options, type: 'warning' });
    },
    [addToast]
  );

  // Helper: toast.info
  toast.info = useCallback(
    (message, options = {}) => {
      return addToast(message, { ...options, type: 'info' });
    },
    [addToast]
  );

  // Helper: toast.loading
  toast.loading = useCallback(
    (message, options = {}) => {
      return addToast(message, {
        ...options,
        type: 'loading',
        duration: false, // does not auto-dismiss
        showProgressBar: false,
      });
    },
    [addToast]
  );

  // Helper: toast.promise
  toast.promise = useCallback(
    (promise, messages, options = {}) => {
      const id = toast.loading(messages.loading || 'Loading...', options);

      const p = promise instanceof Promise ? promise : Promise.resolve(promise);

      p.then((result) => {
        const successMsg =
          typeof messages.success === 'function' ? messages.success(result) : messages.success || 'Success!';
        updateToast(id, {
          type: 'success',
          message: successMsg,
          duration: options.duration !== undefined ? options.duration : 3000,
          showProgressBar: options.showProgressBar !== undefined ? options.showProgressBar : true,
          ...options.successOptions,
        });
      }).catch((err) => {
        const errorMsg =
          typeof messages.error === 'function' ? messages.error(err) : messages.error || 'Something went wrong';
        updateToast(id, {
          type: 'error',
          message: errorMsg,
          duration: options.duration !== undefined ? options.duration : 4000,
          showProgressBar: options.showProgressBar !== undefined ? options.showProgressBar : true,
          ...options.errorOptions,
        });
      });

      return p;
    },
    [toast, updateToast]
  );

  // Programmatic dismiss
  toast.dismiss = dismissToast;
  toast.dismissAll = dismissAll;
  toast.update = updateToast;

  return toast;
};
