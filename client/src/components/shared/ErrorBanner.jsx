// src/components/shared/ErrorBanner.jsx
// Displays an error message in a dismissible banner.
// Member 4 owns this file.
//
// Usage: <ErrorBanner message={error} onDismiss={() => setError(null)} onRetry={fetchData} />

const ErrorBanner = ({ message, onDismiss, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <span className="error-banner__icon">⚠️</span>
      <span className="error-banner__message">{message}</span>
      <div className="error-banner__actions">
        {onRetry && (
          <button className="error-banner__retry" onClick={onRetry}>
            Try Again
          </button>
        )}
        {onDismiss && (
          <button className="error-banner__close" onClick={onDismiss} aria-label="Dismiss error">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
