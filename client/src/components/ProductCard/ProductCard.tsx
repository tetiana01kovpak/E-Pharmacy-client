import { Link } from 'react-router-dom';
import { Button } from '../ui/Button/Button';
import { Rating } from '../ui/Rating/Rating';
import type { Product } from '../../types';
import styles from './ProductCard.module.css';

type ProductCardProps = {
  product: Product;
  onAddToCart: (productId: string) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <img src={product.image} alt={product.name} className={styles.image} width={200} height={200} loading="lazy" />
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.brand}>{product.brand}</p>
      <Rating value={product.avgRating} variant="stars" />
      <p className={styles.price}>${product.price.toFixed(2)}</p>

      <div className={styles.actions}>
        <Button onClick={() => onAddToCart(product._id)}>Add to cart</Button>
        <Link to={`/product/${product._id}`} className={styles.detailsLink}>
          Details
        </Link>
      </div>
    </article>
  );
}
