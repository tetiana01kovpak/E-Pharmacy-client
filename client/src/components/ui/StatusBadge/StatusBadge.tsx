import clsx from 'clsx';
import styles from './StatusBadge.module.css';

type StatusBadgeProps = {
  isOpen: boolean;
};

export function StatusBadge({ isOpen }: StatusBadgeProps) {
  return (
    <span className={clsx(styles.badge, isOpen ? styles.open : styles.closed)}>
      {isOpen ? 'OPEN' : 'CLOSE'}
    </span>
  );
}
