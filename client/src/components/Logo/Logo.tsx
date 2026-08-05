import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Logo.module.css';

type LogoProps = {
  variant?: 'dark' | 'light';
  className?: string;
};

export function Logo({ variant = 'dark', className }: LogoProps) {
  return (
    <Link to="/home" className={clsx(styles.logo, className)} aria-label="E-Pharmacy home">
      <svg className={styles.mark} width="32" height="32" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="22" fill="#59B17A" />
        <path
          d="M22 11c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11Zm0 4.4a1.467 1.467 0 0 1 1.467 1.467v3.666h3.666a1.467 1.467 0 1 1 0 2.934h-3.666v3.666a1.467 1.467 0 1 1-2.934 0v-3.666h-3.666a1.467 1.467 0 1 1 0-2.934h3.666v-3.666A1.467 1.467 0 0 1 22 15.4Z"
          fill="#fff"
        />
      </svg>
      <span className={clsx(styles.text, variant === 'light' && styles.light)}>E-Pharmacy</span>
    </Link>
  );
}
