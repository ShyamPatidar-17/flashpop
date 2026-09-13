import React from 'react';
import { createPortal } from 'react-dom';
import { ToastItem } from './ToastItem';

const VALID_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

/**
 * ToastContainer Component
 * Renders toast groups in their respective screen positions via a React Portal.
 */
export const ToastContainer = ({
  toasts = [],
  onDismiss,
  position: defaultPosition = 'top-right',
  theme: defaultTheme = 'light',
  newestOnTop = false,
  pauseOnHover = true,
  showProgressBar = true,
  swipeable = true,
  swipeThreshold = 70,
  limit,
  className = '',
  style = {},
}) => {
  // Guard for SSR (Next.js, Gatsby, Remix)
  const isMounted = typeof window !== 'undefined' && typeof document !== 'undefined';

  if (!isMounted) {
    return null;
  }

  // Filter toasts if limit is set
  const visibleToasts = limit && limit > 0 ? toasts.slice(-limit) : toasts;

  // Group toasts by position
  const groupedToasts = visibleToasts.reduce((acc, toast) => {
    const pos = toast.position || defaultPosition;
    const validPos = VALID_POSITIONS.includes(pos) ? pos : 'top-right';
    if (!acc[validPos]) {
      acc[validPos] = [];
    }
    acc[validPos].push(toast);
    return acc;
  }, {});

  const portalContent = (
    <div className={`easy-toast-portal ${className}`} style={style}>
      {Object.entries(groupedToasts).map(([pos, items]) => {
        const sortedItems = newestOnTop ? [...items].reverse() : items;

        return (
          <div
            key={pos}
            className={`easy-toast-container easy-toast-container--${pos}`}
            aria-live="polite"
          >
            {sortedItems.map((toast) => (
              <ToastItem
                key={toast.id}
                {...toast}
                pauseOnHover={toast.pauseOnHover ?? pauseOnHover}
                showProgressBar={toast.showProgressBar ?? showProgressBar}
                swipeable={toast.swipeable ?? swipeable}
                swipeThreshold={toast.swipeThreshold ?? swipeThreshold}
                theme={toast.theme || defaultTheme}
                onDismiss={onDismiss}
              />
            ))}
          </div>
        );
      })}
    </div>
  );

  return createPortal(portalContent, document.body);
};
