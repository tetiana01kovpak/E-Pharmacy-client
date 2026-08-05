import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <RegisterForm submitLabel="Register" onSuccess={() => navigate('/home')} />
      <p className={styles.switchLink}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
