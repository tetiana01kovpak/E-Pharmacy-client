import { Icon } from '../ui/Icon/Icon';
import { Rating } from '../ui/Rating/Rating';
import { StatusBadge } from '../ui/StatusBadge/StatusBadge';
import { Button } from '../ui/Button/Button';
import type { Store } from '../../types';
import styles from './StoreCard.module.css';

type StoreCardProps = {
  store: Store;
};

export function StoreCard({ store }: StoreCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{store.name}</h3>
        <StatusBadge isOpen={store.isOpen} />
      </div>

      <p className={styles.detail}>
        <Icon name="map-pin" size={16} />
        {store.address}
      </p>
      <p className={styles.detail}>
        <Icon name="phone" size={16} />
        {store.phone}
      </p>

      <div className={styles.footer}>
        <Button variant="secondary">Visit Store</Button>
        <Rating value={store.rating} />
      </div>
    </article>
  );
}
