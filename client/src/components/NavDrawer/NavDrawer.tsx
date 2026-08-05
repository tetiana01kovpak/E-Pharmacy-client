import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon/Icon';
import styles from './NavDrawer.module.css';

type NavDrawerProps = {
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogoutClick: () => void;
};

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/medicine-store', label: 'Medicine store' },
  { to: '/medicine', label: 'Medicine' },
];

export function NavDrawer({
  isOpen,
  isLoggedIn,
  onClose,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
}: NavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <button type="button" className={styles.scrim} aria-label="Close menu" onClick={onClose} />
      <nav className={styles.drawer} aria-label="Mobile navigation">
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
          <Icon name="close" size={24} />
        </button>

        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.authArea}>
          {isLoggedIn ? (
            <button type="button" className={styles.logoutBtn} onClick={onLogoutClick}>
              Log out
            </button>
          ) : (
            <>
              <button type="button" className={styles.registerBtn} onClick={onRegisterClick}>
                Register
              </button>
              <button type="button" className={styles.loginLink} onClick={onLoginClick}>
                Login
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
