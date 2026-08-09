import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import logoMark from '../../assets/logo-mark.png';
import styles from './Logo.module.css';

type LogoProps = {
  variant?: 'dark' | 'light';
  className?: string;
};

const markStyle = { '--logo-mark-url': `url(${logoMark})` } as CSSProperties;

export function Logo({ variant = 'dark', className }: LogoProps) {
  return (
    <Link to="/home" className={clsx(styles.logo, className)} aria-label="E-Pharmacy home">
      <span
        className={clsx(styles.mark, variant === 'light' && styles.markLight)}
        style={markStyle}
        aria-hidden="true"
      />
      <span className={clsx(styles.text, variant === 'light' && styles.light)}>E-Pharmacy</span>
    </Link>
  );
}
