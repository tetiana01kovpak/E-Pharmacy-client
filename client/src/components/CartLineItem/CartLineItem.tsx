import { Button } from '../ui/Button/Button';
import { QuantityStepper } from '../ui/QuantityStepper/QuantityStepper';
import type { CartLine } from '../../types';
import styles from './CartLineItem.module.css';

type CartLineItemProps = {
  item: CartLine;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
};

export function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  return (
    <div className={styles.row}>
      <img
        src={item.image}
        alt={item.name}
        className={styles.thumbnail}
        width={64}
        height={64}
        loading="lazy"
        referrerPolicy="no-referrer"
      />

      <div className={styles.info}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.brand}>{item.brand}</p>
      </div>

      <p className={styles.unitPrice}>${item.price.toFixed(2)}</p>

      <QuantityStepper value={item.quantity} onChange={(quantity) => onQuantityChange(item.productId, quantity)} />

      <p className={styles.lineTotal}>${item.lineTotal.toFixed(2)}</p>

      <Button variant="danger" onClick={() => onRemove(item.productId)}>
        Remove
      </Button>
    </div>
  );
}
