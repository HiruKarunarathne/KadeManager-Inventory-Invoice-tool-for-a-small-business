// src/components/shared/Loader.jsx
// Full-page loading spinner shown while data is being fetched or session is restoring.
// Member 4 owns this file.

const Loader = ({ message = 'Loading...' }) => (
  <div className="loader-container" aria-live="polite" aria-label={message}>
    <div className="loader-spinner" />
    <p className="loader-message">{message}</p>
  </div>
);

export default Loader;
