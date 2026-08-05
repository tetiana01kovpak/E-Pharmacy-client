import { Icon } from '../Icon/Icon';
import styles from './Rating.module.css';

type RatingProps = {
  value: number;
  variant?: 'compact' | 'stars';
};

export function Rating({ value, variant = 'compact' }: RatingProps) {
  if (variant === 'stars') {
    return (
      <div className={styles.starsRow} aria-label={`Rating: ${value} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Icon
            key={i}
            name="star"
            size={16}
            className={i < Math.round(value) ? styles.starFilled : styles.starEmpty}
          />
        ))}
        <span className={styles.badge}>{value}</span>
      </div>
    );
  }

  return (
    <span className={styles.compact} aria-label={`Rating: ${value} out of 5`}>
      <Icon name="star" size={16} className={styles.starFilled} />
      {value}
    </span>
  );
}
