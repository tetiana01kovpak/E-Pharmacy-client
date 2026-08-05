import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/home';

  return (
    <div className={styles.wrapper}>
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      <p className={styles.switchLink}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
