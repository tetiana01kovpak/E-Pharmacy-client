import { Outlet } from 'react-router-dom';
import { Logo } from '../../components/Logo/Logo';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <main className={styles.page}>
      <div className={styles.brandPane}>
        <Logo className={styles.logo} />
        <h1 className={styles.headline}>
          Your medication, delivered <span className={styles.accent}>Say goodbye to all your healthcare worries with us</span>
        </h1>
        <div className={styles.decoration} aria-hidden="true">
          <span className={styles.pill} />
          <span className={styles.pill} />
          <span className={styles.pill} />
        </div>
      </div>

      <div className={styles.formPane}>
        <Outlet />
      </div>
    </main>
  );
}
