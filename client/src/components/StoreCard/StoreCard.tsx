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
  const [addressLine1, ...addressRest] = store.address.split(', ');
  const addressLine2 = addressRest.join(', ');

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{store.name}</h3>
        <div className={styles.headerRight}>
          <Rating value={store.rating} />
          <StatusBadge isOpen={store.isOpen} />
        </div>
      </div>

      <p className={styles.detail}>
        <Icon name="map-pin" size={18} />
        <span className={styles.addressLines}>
          <span>{addressLine1}</span>
          {addressLine2 && <span>{addressLine2}</span>}
        </span>
      </p>
      <p className={styles.detail}>
        <Icon name="phone" size={18} />
        {store.phone}
      </p>

      <div className={styles.footer}>
        <Button variant="secondary">Visit Store</Button>
      </div>
    </article>
  );
}
