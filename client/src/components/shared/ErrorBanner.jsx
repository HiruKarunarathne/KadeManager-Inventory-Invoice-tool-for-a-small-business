// src/components/shared/ErrorBanner.jsx
// Displays an error message in a dismissible banner.
// Member 4 owns this file.
//
// Usage: <ErrorBanner message={error} onDismiss={() => setError(null)} />
//   or:  <ErrorBanner message={error} onClose={() => setError(null)} />

import styles from './ErrorBanner.module.css';

/**
 * ErrorBanner — displays API or validation error messages.
 * @param {string|null} message - Error message to display. Renders nothing if null.
 * @param {Function} [onDismiss] - Optional dismiss handler (also aliased as onClose).
 * @param {Function} [onClose]   - Alias for onDismiss.
 */
const ErrorBanner = ({ message, onDismiss, onClose }) => {
  const handleClose = onDismiss || onClose;
  if (!message) return null;

  return (
    <div className={styles.banner} role="alert">
      <span>⚠️ {message}</span>
      {handleClose && (
        <button onClick={handleClose} className={styles.closeBtn} aria-label="Dismiss error">
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
