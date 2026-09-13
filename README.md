# flashpop

[![npm version](https://img.shields.io/npm/v/flashpop.svg?style=flat-square)](https://www.npmjs.com/package/flashpop)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ShyamPatidar-17/flashpop/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/flashpop?style=flat-square)](https://bundlephobia.com/package/flashpop)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ShyamPatidar-17/flashpop/pulls)

A lightweight, modern, and highly customizable React notification and toast library. Built with **React Hooks**, the **Context API**, and **zero external icon/CSS runtime dependencies**.

---

## ✨ Features

- 🪶 **Ultra Lightweight**: Zero runtime dependencies. Clean inline SVGs for all status icons.
- ⚡ **React Context & Hooks**: Intuitive `useToast()` hook and `<ToastProvider>` wrapper.
- 🎨 **Modern Design**: Soft shadows, frosted glass effects, clean typography, and 3 built-in themes (`light`, `dark`, `colored`).
- ⏱️ **Auto-Dismiss & Progress Bar**: Smooth 60fps CSS countdown bar with **pause-on-hover** support.
- 📍 **6 Flexible Screen Positions**: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.
- 🔄 **Async Promises Support**: Effortlessly handle pending, success, and error states with `toast.promise()`.
- 🔘 **Interactive Action Buttons**: Support for interactive buttons inside toasts (e.g., "Undo", "Retry").
- 👆 **Swipe to Accept & Cancel**: Touch and mouse drag gestures to **swipe right to accept** and **swipe left to cancel/dismiss** with live visual badges.
- 📱 **Fully Responsive**: Adapts seamlessly to mobile screens and respects safe area insets.
- ♿ **Accessible**: Includes standard ARIA roles (`status`, `alert`) and live regions (`polite`, `assertive`).
- 📘 **TypeScript Ready**: Complete TypeScript definition files (`.d.ts`) included.

---

## 📦 Installation

Install `flashpop` via your package manager of choice:

```bash
# Using npm
npm install flashpop

# Using yarn
yarn add flashpop

# Using pnpm
pnpm add flashpop
```

---

## 🚀 Quick Start

### 1. Wrap your application with `<ToastProvider>`

Wrap your root component (e.g., in `App.jsx`, `index.jsx`, or `_app.tsx` for Next.js) and import the CSS stylesheet:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Import Provider and stylesheet
import { ToastProvider } from 'flashpop';
import 'flashpop/dist/toast.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider position="top-right" autoClose={3000}>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
```

### 2. Trigger notifications with `useToast()`

Inside any component wrapped by `<ToastProvider>`, invoke the `useToast()` hook:

```jsx
import React from 'react';
import { useToast } from 'flashpop';

function Dashboard() {
  const toast = useToast();

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => toast.success('Profile saved successfully!')}>
        Success
      </button>

      <button onClick={() => toast.error('Failed to connect to server.')}>
        Error
      </button>

      <button onClick={() => toast.warning('Your session will expire soon.')}>
        Warning
      </button>

      <button onClick={() => toast.info('A new version is available.')}>
        Info
      </button>
    </div>
  );
}

export default Dashboard;
```

---

## 📖 Usage Examples

### 1. Titles & Detailed Messages

```jsx
toast.info('Your password has been changed from another device.', {
  title: 'Security Alert',
  duration: 5000,
});
```

### 2. Action Buttons (e.g., "Undo")

```jsx
toast.warning('Item removed from cart.', {
  title: 'Cart Updated',
  action: {
    label: 'Undo',
    onClick: (id) => {
      restoreItem();
      console.log(`Toast ${id} action clicked`);
    },
    dismissOnClick: true, // Automatically close toast when action clicked (default: true)
  },
});
```

### 3. Handling Async Promises with `toast.promise`

`toast.promise` automatically creates a loading toast, keeps it alive during the asynchronous operation, and transitions smoothly into a success or error toast upon completion:

```jsx
const uploadFile = async () => {
  const uploadPromise = api.uploadDocument(file);

  await toast.promise(uploadPromise, {
    loading: 'Uploading document...',
    success: (result) => `Document "${result.name}" uploaded successfully!`,
    error: (err) => `Upload failed: ${err.message}`,
  });
};
```

### 4. Custom Duration & Persistent Toasts

```jsx
// Persistent toast (will not auto-dismiss)
toast.info('Please review the updated Terms of Service.', {
  duration: false, // or Infinity
  closeButton: true,
});

// Fast auto-dismiss
toast.success('Quick notice!', { duration: 1500 });
```

### 5. Custom Icons & Custom Styling

```jsx
// Use custom SVG or React icon component
toast('Custom Star Alert', {
  icon: <span>⭐</span>,
  style: {
    borderRadius: '16px',
    border: '2px dashed #6366f1',
  },
});

// Hide icon entirely
toast('Text-only notification', { icon: false });
```

### 6. Themes

Choose between 3 built-in themes: `light` (default), `dark`, or `colored`:

```jsx
// Global theme on provider
<ToastProvider theme="dark">
  <App />
</ToastProvider>

// Or override on individual toast
toast.error('Fatal crash!', { theme: 'colored' });
```

### 7. Dynamic Positioning

Position toasts dynamically per container or per toast:

```jsx
// Set position on individual toast
toast.success('Bottom center notification', {
  position: 'bottom-center',
});
```

Available positions:
- `top-left`
- `top-center`
- `top-right` *(default)*
- `bottom-left`
- `bottom-center`
- `bottom-right`

### 8. Programmatic Dismissal

```jsx
const toastId = toast.loading('Processing heavy job...');

// Dismiss specific toast later
toast.dismiss(toastId);

### 9. Swipe to Accept or Cancel Gestures

Users on mobile touch devices or desktop can swipe notification cards:
- **Swipe Right**: Triggers the `onAccept` handler (or `action.onClick`) and dismisses the toast. If no accept action is configured, swiping right dismisses the toast.
- **Swipe Left**: Triggers `onCancel` and dismisses the toast.

```jsx
// Interactive access request with Swipe gestures
toast.info('Sarah requested access to the Analytics Dashboard.', {
  title: 'Permission Request',
  duration: 10000,
  acceptLabel: 'Grant Access',
  cancelLabel: 'Deny',
  onAccept: (id) => {
    console.log('Granted access!');
    toast.success('Access granted to Sarah');
  },
  onCancel: (id) => {
    console.log('Denied request');
    toast.error('Access request rejected');
  },
});

// Standard toast - swiping either left or right dismisses it
toast.success('Swipe in any direction to dismiss me!');
```

---

## ⚙️ API Reference

### `<ToastProvider>` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `string` | `'top-right'` | Default screen position for toasts. |
| `autoClose` | `number \| false` | `3000` | Auto-dismiss delay in ms. Set `false` to disable. |
| `pauseOnHover` | `boolean` | `true` | Pauses timer and countdown animation when hovered. |
| `showProgressBar`| `boolean` | `true` | Shows animated countdown progress bar. |
| `swipeable` | `boolean` | `true` | Enable touch/mouse swipe gestures globally. |
| `swipeThreshold` | `number` | `70` | Drag distance in px required to trigger swipe actions. |
| `theme` | `'light' \| 'dark' \| 'colored'` | `'light'` | Theme style applied to notifications. |
| `limit` | `number` | `undefined` | Maximum number of toasts displayed simultaneously. |
| `newestOnTop` | `boolean` | `false` | When `true`, newer toasts stack above older toasts. |
| `containerClassName` | `string` | `''` | Custom CSS class name for container. |
| `containerStyle` | `CSSProperties` | `{}` | Inline CSS styles for container wrapper. |

### `toast(message, options)` / Toast Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `'default' \| 'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` | `'default'` | Type variant of the toast. |
| `title` | `ReactNode` | `undefined` | Optional bold header title. |
| `duration` | `number \| false` | *Provider default* | Duration in ms before auto-dismissal. `false` disables timer. |
| `position` | `ToastPosition` | *Provider default* | Position anchor for this specific toast. |
| `theme` | `'light' \| 'dark' \| 'colored'` | *Provider default* | Theme for this specific toast. |
| `icon` | `ReactNode \| false` | *Default type icon* | Custom icon component or `false` to disable icon. |
| `action` | `{ label: string, onClick: (id) => void, dismissOnClick?: boolean }` | `undefined` | Interactive action button inside the toast. |
| `onAccept` | `(id: string) => void` | `undefined` | Callback fired when user swipes right to accept. |
| `onCancel` | `(id: string) => void` | `undefined` | Callback fired when user swipes left to cancel. |
| `acceptLabel` | `string` | `'Accept'` | Label displayed on badge when swiping right. |
| `cancelLabel` | `string` | `'Dismiss'` | Label displayed on badge when swiping left. |
| `swipeable` | `boolean` | `true` | Enable or disable swipe gestures for this toast. |
| `swipeThreshold`| `number` | `70` | Drag distance in px to trigger swipe action. |
| `showProgressBar`| `boolean` | *Provider default* | Toggle progress countdown bar for this toast. |
| `pauseOnHover` | `boolean` | *Provider default* | Pause timer on mouse enter. |
| `closeButton` | `boolean` | `true` | Show manual close 'X' button. |
| `onClose` | `(id: string) => void` | `undefined` | Callback fired when toast begins closing. |
| `className` | `string` | `''` | Custom class name for the toast item. |
| `style` | `CSSProperties` | `{}` | Custom inline style for the toast item. |

### `useToast()` Methods

| Method | Description |
| :--- | :--- |
| `toast(message, options?)` | Displays a default toast. |
| `toast.success(message, options?)` | Displays a success toast with checkmark icon. |
| `toast.error(message, options?)` | Displays an error toast with error alert icon. |
| `toast.warning(message, options?)` | Displays a warning toast with warning triangle icon. |
| `toast.info(message, options?)` | Displays an info toast with info icon. |
| `toast.loading(message, options?)` | Displays a persistent loading toast with animated spinner. |
| `toast.promise(promise, messages, options?)` | Tracks a Promise and updates dynamically on resolution/rejection. |
| `toast.dismiss(id)` | Dismisses a specific toast with an exit animation. |
| `toast.dismissAll()` | Dismisses all currently visible toasts. |
| `toast.update(id, options)` | Updates properties of an active toast (e.g., message, type). |

---

## 🛠️ Building the Library

If you want to contribute or build the package locally:

```bash
# 1. Install dependencies
npm install

# 2. Build the bundle for ESM, CJS, and CSS
npm run build
```

This will produce the production-ready distribution in the `/dist` directory:
- `dist/index.esm.js` (ES Module bundle)
- `dist/index.cjs.js` (CommonJS bundle)
- `dist/index.d.ts` (TypeScript definitions)
- `dist/toast.css` (Compiled and minified CSS)

---

## 📄 License

MIT © [Shyam Patidar](https://github.com/ShyamPatidar-17/flashpop)
