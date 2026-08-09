import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Logo } from '../Logo/Logo';
import { NavDrawer } from '../NavDrawer/NavDrawer';
import { Icon } from '../ui/Icon/Icon';
import { Button } from '../ui/Button/Button';
import { logoutUser } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './Header.module.css';

const NAV_LINKS = [
  { to: '/home', label: 'Home', slotWidth: 96 },
  { to: '/medicine-store', label: 'Medicine store', slotWidth: 134 },
  { to: '/medicine', label: 'Medicine', slotWidth: 112 },
];

export function Header() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const totalItems = useAppSelector((state) => state.cart.totalItems);

  const isHero = location.pathname === '/home' || location.pathname === '/';

  const closeDrawer = () => setDrawerOpen(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    closeDrawer();
    navigate('/home');
  };

  return (
    <header className={clsx(styles.header, isHero && styles.transparent)}>
      <div className={clsx('container', styles.inner)}>
        <Logo variant={isHero ? 'light' : 'dark'} />

        <nav className={styles.desktopNav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.to} className={styles.navSlot} style={{ width: link.slotWidth }}>
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
              <Link to="/register" className={clsx(styles.textLink, isHero && styles.registerLinkOnHero)}>
                Register
              </Link>
              <Link to="/login" className={clsx(styles.textLink, styles.loginLink, isHero && styles.loginLinkOnHero)}>
                Login
              </Link>
            </div>
          )}

          <button
            type="button"
            className={clsx(styles.hamburgerBtn, isHero && styles.hamburgerBtnOnHero)}
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
