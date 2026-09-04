// src/components/shared/ErrorBanner.jsx
// Displays an error message in a dismissible banner.
// Member 4 owns this file.
//
// Usage: <ErrorBanner message={error} onDismiss={() => setError(null)} />

import { useState } from 'react';

const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <span className="error-banner__icon">⚠️</span>
      <span className="error-banner__message">{message}</span>
      {onDismiss && (
        <button className="error-banner__close" onClick={onDismiss} aria-label="Dismiss error">
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
