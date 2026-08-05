import styles from './Loader.module.css';

export function Loader() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <span className={styles.spinner} />
    </div>
  );
}
