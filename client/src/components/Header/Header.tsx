import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Logo } from '../Logo/Logo';
import { NavDrawer } from '../NavDrawer/NavDrawer';
import { Icon } from '../ui/Icon/Icon';
import { Button } from '../ui/Button/Button';
import { logoutUser } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './Header.module.css';

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/medicine-store', label: 'Medicine store' },
  { to: '/medicine', label: 'Medicine' },
];

export function Header() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const totalItems = useAppSelector((state) => state.cart.totalItems);

  const closeDrawer = () => setDrawerOpen(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    closeDrawer();
    navigate('/home');
  };

  return (
    <header className={styles.header}>
      <div className={clsx('container', styles.inner)}>
        <Logo />

        <nav className={styles.desktopNav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => clsx(styles.navLink, isActive && styles.active)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {isLoggedIn && (
            <>
              <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
                <Icon name="shopping-cart" size={20} />
                {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
              </Link>
              <span className={styles.avatar} aria-hidden="true">
                {user?.name?.[0]?.toUpperCase() ?? '?'}
              </span>
              <Button variant="secondary" className={styles.desktopOnly} onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}

          {!isLoggedIn && (
            <div className={clsx(styles.guestActions, styles.desktopOnly)}>
              <Link to="/register" className={styles.textLink}>
                Register
              </Link>
              <Link to="/login" className={styles.textLink}>
                Login
              </Link>
            </div>
          )}

          <button
            type="button"
            className={styles.hamburgerBtn}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>

      <NavDrawer
        isOpen={isDrawerOpen}
        isLoggedIn={isLoggedIn}
        onClose={closeDrawer}
        onLoginClick={() => {
          closeDrawer();
          navigate('/login');
        }}
        onRegisterClick={() => {
          closeDrawer();
          navigate('/register');
        }}
        onLogoutClick={handleLogout}
      />
    </header>
  );
}
