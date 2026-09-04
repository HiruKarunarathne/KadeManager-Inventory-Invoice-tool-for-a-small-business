import styles from './Loader.module.css';

/**
 * Loader — spinner component.
 * @param {boolean} [fullScreen] - If true, centers vertically in the viewport.
 * @param {string}  [message]    - Optional loading message below spinner.
 */
const Loader = ({ fullScreen = false, message = 'Loading...' }) => (
  <div className={`${styles.wrapper} ${fullScreen ? styles.fullScreen : ''}`}>
    <div className={styles.spinner} role="status" aria-label={message} />
    {message && <p className={styles.message}>{message}</p>}
  </div>
);

export default Loader;
