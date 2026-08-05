import { Link } from 'react-router-dom';
import { Logo } from '../Logo/Logo';
import { Icon } from '../ui/Icon/Icon';
import styles from './Footer.module.css';

const NAV_LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/medicine-store', label: 'Medicine store' },
  { to: '/medicine', label: 'Medicine' },
];

const SOCIAL_LINKS = [
  { name: 'facebook', url: 'https://www.facebook.com/goITclub/', label: 'Facebook' },
  { name: 'instagram', url: 'https://www.instagram.com/goitclub/', label: 'Instagram' },
  { name: 'youtube', url: 'https://www.youtube.com/c/GoIT', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Logo variant="light" />
          <p className={styles.tagline}>
            Get the medicine to help you feel better, get back to your active life, and enjoy every moment
          </p>
        </div>

        <div className={styles.right}>
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className={styles.socialList}>
            {SOCIAL_LINKS.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  <Icon name={social.name} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>&copy; E-Pharmacy 2023. All Rights Reserved</p>
        <div className={styles.legalLinks}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span className={styles.divider} aria-hidden="true" />
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
