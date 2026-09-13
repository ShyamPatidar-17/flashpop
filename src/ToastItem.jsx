import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  InfoIcon,
  LoadingIcon,
  CloseIcon,
} from './icons';

/**
 * ToastItem Component
 * Renders an individual notification card with animations, timers, actions, and swipe to accept/cancel.
 */
export const ToastItem = ({
  id,
  type = 'default',
  title,
  message,
  duration = 3000,
  showProgressBar = true,
  pauseOnHover = true,
  closeButton = true,
  icon,
  action,
  onClose,
  onAccept,
  onCancel,
  acceptLabel,
  cancelLabel = 'Dismiss',
  swipeable = true,
  swipeThreshold = 70,
  theme = 'light',
  className = '',
  style = {},
  onDismiss,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState(null); // 'left' | 'right' | null
  const [isPaused, setIsPaused] = useState(false);

  // Swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const isPointerDownRef = useRef(false);
  
  // Ref to track remaining duration when paused
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  // Check if this toast supports an "accept" action
  const hasAcceptAction = Boolean(onAccept || (action && action.onClick));
  const resolvedAcceptLabel = acceptLabel || (action && action.label) || 'Accept';

  // Trigger graceful exit animation before removal
  const handleDismiss = useCallback((direction = null) => {
    if (isExiting) return;
    setIsExiting(true);
    if (direction) {
      setExitDirection(direction);
    }
    if (onClose) {
      onClose(id);
    }
    // Match the CSS exit animation duration
    setTimeout(() => {
      onDismiss(id);
    }, 280);
  }, [id, isExiting, onClose, onDismiss]);

  // Trigger accept action
  const handleAccept = useCallback(() => {
    if (isExiting) return;
    if (onAccept) {
      onAccept(id);
    } else if (action && action.onClick) {
      action.onClick(id);
    }
    handleDismiss('right');
  }, [action, handleDismiss, id, isExiting, onAccept]);

  // Handle auto-dismiss timer
  useEffect(() => {
    if (duration === false || duration === Infinity || duration <= 0) {
      return;
    }

    const startTimer = (time) => {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, time);
    };

    if (!isPaused && !isDragging) {
      startTimer(remainingTimeRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, isPaused, isDragging, handleDismiss]);

  // Pause on mouse enter
  const handleMouseEnter = () => {
    if (!pauseOnHover || duration === false || duration === Infinity || duration <= 0) {
      return;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
    setIsPaused(true);
  };

  // Resume on mouse leave
  const handleMouseLeave = () => {
    if (!pauseOnHover || duration === false || duration === Infinity || duration <= 0 || isDragging) {
      return;
    }
    setIsPaused(false);
  };

  // --- Pointer Swipe Handlers ---
  const handlePointerDown = (e) => {
    if (!swipeable || isExiting) return;
    // Don't drag if clicking buttons or interactive elements
    if (e.target.closest('button') || e.target.closest('a')) return;
    if (e.button !== undefined && e.button !== 0) return; // Only primary mouse button

    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    setIsDragging(true);

    // Pause timer while swiping
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // Ignore if setPointerCapture not supported
    }
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current || !isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore
    }

    // Check if swipe distance exceeded threshold
    if (dragOffset >= swipeThreshold) {
      // Swiped Right
      if (hasAcceptAction) {
        handleAccept();
      } else {
        if (onCancel) onCancel(id);
        handleDismiss('right');
      }
    } else if (dragOffset <= -swipeThreshold) {
      // Swiped Left
      if (onCancel) onCancel(id);
      handleDismiss('left');
    } else {
      // Reset back to center
      setDragOffset(0);
      setIsPaused(false);
    }
  };

  const handlePointerCancel = () => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
    setIsPaused(false);
  };

  // Resolve appropriate icon
  const renderIcon = () => {
    if (icon === false) return null;
    if (icon && React.isValidElement(icon)) {
      return <span className="easy-toast-custom-icon">{icon}</span>;
    }

    switch (type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      case 'loading':
        return <LoadingIcon />;
      default:
        return null;
    }
  };

  const hasIcon = icon !== false && (icon || type !== 'default');
  const hasProgressBar = showProgressBar && duration && duration !== Infinity && duration > 0;

  // Compute inline drag transform
  const getDragStyle = () => {
    if (isDragging) {
      return {
        transform: `translateX(${dragOffset}px)`,
        transition: 'none',
        opacity: Math.max(0.45, 1 - Math.abs(dragOffset) / 280),
      };
    }
    if (exitDirection === 'left') {
      return {
        transform: 'translateX(-115%) scale(0.9)',
        opacity: 0,
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 1, 1), opacity 0.28s ease',
      };
    }
    if (exitDirection === 'right') {
      return {
        transform: 'translateX(115%) scale(0.9)',
        opacity: 0,
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 1, 1), opacity 0.28s ease',
      };
    }
    return {
      transition: 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease',
    };
  };

  // Visual cues during swipe
  const isSwipingAccept = dragOffset > 25 && hasAcceptAction;
  const isSwipingDismissRight = dragOffset > 25 && !hasAcceptAction;
  const isSwipingCancel = dragOffset < -25;

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`easy-toast-item easy-toast--${type} easy-toast--theme-${theme} ${
        isExiting ? 'easy-toast--exit' : 'easy-toast--enter'
      } ${swipeable ? 'easy-toast--swipeable' : ''} ${
        isDragging ? 'easy-toast--dragging' : ''
      } ${isSwipingAccept ? 'easy-toast--swipe-accept' : ''} ${
        isSwipingCancel || isSwipingDismissRight ? 'easy-toast--swipe-cancel' : ''
      } ${className}`}
      style={{
        ...style,
        ...getDragStyle(),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* Swipe Badges/Hints */}
      {isSwipingAccept && (
        <div className="easy-toast-swipe-badge easy-toast-swipe-badge--accept">
          ✓ {resolvedAcceptLabel}
        </div>
      )}

      {(isSwipingCancel || isSwipingDismissRight) && (
        <div className="easy-toast-swipe-badge easy-toast-swipe-badge--cancel">
          ✕ {cancelLabel}
        </div>
      )}

      <div className="easy-toast-content-wrapper">
        {hasIcon && <div className="easy-toast-icon-container">{renderIcon()}</div>}

        <div className="easy-toast-text-container">
          {title && <div className="easy-toast-title">{title}</div>}
          <div className="easy-toast-message">{message}</div>
        </div>

        {action && (
          <div className="easy-toast-action-container">
            <button
              type="button"
              className="easy-toast-action-button"
              onClick={() => {
                action.onClick?.(id);
                if (action.dismissOnClick !== false) {
                  handleDismiss('right');
                }
              }}
            >
              {action.label}
            </button>
          </div>
        )}

        {closeButton && (
          <button
            type="button"
            className="easy-toast-close-button"
            aria-label="Close notification"
            onClick={() => handleDismiss()}
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {hasProgressBar && (
        <div className="easy-toast-progress-bar-track">
          <div
            className="easy-toast-progress-bar"
            style={{
              animationDuration: `${duration}ms`,
              animationPlayState: isPaused || isDragging ? 'paused' : 'running',
            }}
          />
        </div>
      )}
    </div>
  );
};
