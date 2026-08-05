import clsx from 'clsx';
import { Rating } from '../ui/Rating/Rating';
import styles from './ReviewCard.module.css';

type HomeReviewCardProps = {
  variant: 'home';
  name: string;
  avatarUrl: string;
  quote: string;
};

type ProductReviewCardProps = {
  variant: 'product';
  name: string;
  avatarUrl: string;
  quote: string;
  rating: number;
  date: string;
};

type ReviewCardProps = HomeReviewCardProps | ProductReviewCardProps;

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

export function ReviewCard(props: ReviewCardProps) {
  if (props.variant === 'home') {
    return (
      <article className={styles.homeCard}>
        <img src={props.avatarUrl} alt="" className={styles.homeAvatar} width={64} height={64} loading="lazy" />
        <h3 className={styles.name}>{props.name}</h3>
        <p className={styles.quote}>{props.quote}</p>
      </article>
    );
  }

  return (
    <article className={clsx(styles.homeCard, styles.productCard)}>
      <div className={styles.productHeader}>
        <img src={props.avatarUrl} alt="" className={styles.productAvatar} width={48} height={48} loading="lazy" />
        <div>
          <h3 className={styles.name}>{props.name}</h3>
          <span className={styles.date}>{formatRelativeDate(props.date)}</span>
        </div>
        <Rating value={props.rating} variant="stars" />
      </div>
      <p className={styles.quote}>{props.quote}</p>
    </article>
  );
}
