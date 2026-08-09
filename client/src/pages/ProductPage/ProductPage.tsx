import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Button } from '../../components/ui/Button/Button';
import { QuantityStepper } from '../../components/ui/QuantityStepper/QuantityStepper';
import { Rating } from '../../components/ui/Rating/Rating';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import { Loader } from '../../components/ui/Loader/Loader';
import { ReviewCard } from '../../components/ReviewCard/ReviewCard';
import { fetchProductById, clearCurrentProduct } from '../../redux/products/productSlice';
import { fetchProductReviews } from '../../redux/reviews/reviewsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useAddToCart } from '../../hooks/useAddToCart';
import styles from './ProductPage.module.css';

type Tab = 'description' | 'reviews';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const handleAddToCart = useAddToCart();

  const { current: product, status } = useAppSelector((state) => state.product);
  const reviewsState = useAppSelector((state) => (id ? state.reviews.productReviews[id] : undefined));

  const [tab, setTab] = useState<Tab>('description');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (id && tab === 'reviews') {
      dispatch(fetchProductReviews({ productId: id, page: 1 }));
    }
  }, [dispatch, id, tab]);

  if (status === 'loading' || !product) {
    return <Loader />;
  }

  const descriptionParagraphs = product.description.split('\n\n');

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.overview}>
        <img src={product.image} alt={product.name} className={styles.image} referrerPolicy="no-referrer" />

        <div className={styles.purchaseCard}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.brand}>Brand: {product.brand}</p>
          <Rating value={product.avgRating} />
          <p className={styles.price}>${product.price.toFixed(2)}</p>

          <div className={styles.purchaseRow}>
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <Button onClick={() => handleAddToCart(product._id, quantity)}>Add to cart</Button>
          </div>
        </div>
      </div>

      <div className={styles.tabsPanel}>
        <div className={styles.tabSwitch}>
          <button
            type="button"
            className={clsx(styles.tabBtn, tab === 'description' && styles.tabActive)}
            onClick={() => setTab('description')}
          >
            Description
          </button>
          <button
            type="button"
            className={clsx(styles.tabBtn, tab === 'reviews' && styles.tabActive)}
            onClick={() => setTab('reviews')}
          >
            Reviews
          </button>
        </div>

        {tab === 'description' && (
          <div className={styles.description}>
            {descriptionParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div className={styles.reviews}>
            {!reviewsState && <Loader />}
            {reviewsState && reviewsState.items.length === 0 && <p>No reviews yet for this product.</p>}
            {reviewsState && reviewsState.items.length > 0 && (
              <>
                <div className={styles.reviewList}>
                  {reviewsState.items.map((review) => (
                    <ReviewCard
                      key={review._id}
                      variant="product"
                      name={review.authorName}
                      avatarUrl={review.avatarUrl}
                      quote={review.text}
                      rating={review.rating}
                      date={review.createdAt}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={reviewsState.page}
                  totalPages={reviewsState.totalPages}
                  onPageChange={(newPage) => id && dispatch(fetchProductReviews({ productId: id, page: newPage }))}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
