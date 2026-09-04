import styles from './ErrorBanner.module.css';

/**
 * ErrorBanner — displays API or validation error messages.
 * @param {string|null} message - Error message to display. Renders nothing if null.
 * @param {Function}    [onClose] - Optional dismiss handler.
 */
const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={styles.banner} role="alert">
      <span>⚠️ {message}</span>
      {onClose && (
        <button onClick={onClose} className={styles.closeBtn} aria-label="Dismiss error">
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
