import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StoreCard } from '../../components/StoreCard/StoreCard';
import { ReviewCard } from '../../components/ReviewCard/ReviewCard';
import { Button } from '../../components/ui/Button/Button';
import { Loader } from '../../components/ui/Loader/Loader';
import { fetchNearestStores } from '../../redux/stores/storesSlice';
import { fetchCustomerReviews } from '../../redux/reviews/reviewsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './HomePage.module.css';

const PROMO_BANNERS = [
  { title: 'Huge Sale', stat: '70%', cta: 'Shop now', to: '/medicine?minDiscount=70' },
  { title: 'Secure delivery', stat: '100%', cta: 'Read more', to: '#features' },
  { title: 'Off', stat: '35%', cta: 'Shop now', to: '/medicine?minDiscount=35' },
];

const FEATURES = [
  'Take user orders form online',
  'Create your shop profile',
  'Manage your store',
  'Get more orders',
  'Storage shed',
];

export function HomePage() {
  const dispatch = useAppDispatch();
  const { nearest, status: storesStatus } = useAppSelector((state) => state.stores);
  const { customerReviews, status: reviewsStatus } = useAppSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchNearestStores());
    dispatch(fetchCustomerReviews(3));
  }, [dispatch]);

  return (
    <div>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.heroTitle}>Your medication delivered</h1>
          <p className={styles.heroSubtitle}>Say goodbye to all your healthcare worries with us</p>
        </div>
      </section>

      <section className={`container ${styles.promoSection}`}>
        {PROMO_BANNERS.map((banner) => (
          <div key={banner.title} className={styles.promoCard}>
            <h3>{banner.title}</h3>
            <p className={styles.promoStat}>{banner.stat}</p>
            {banner.to.startsWith('#') ? (
              <a href={banner.to} className={styles.promoLink}>
                {banner.cta}
              </a>
            ) : (
              <Link to={banner.to} className={styles.promoLink}>
                {banner.cta}
              </Link>
            )}
          </div>
        ))}
      </section>

      <section className={`container ${styles.section}`}>
        <h2>Your Nearest Medicine Store</h2>
        <p className={styles.sectionSubtitle}>Search for Medicine, Filter by your location</p>

        {storesStatus === 'loading' ? (
          <Loader />
        ) : (
          <div className={styles.storeGrid}>
            {nearest.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>
        )}
      </section>

      <section className={`container ${styles.ctaSection}`} id="features">
        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Add your local pharmacy online now</h2>
            <p className={styles.ctaText}>
              Enjoy the convenience of having your prescriptions filled from home by connecting with your community
              pharmacy through our online platform.
            </p>
            <Link to="/medicine-store">
              <Button variant="secondary" className={styles.ctaButton}>
                Buy medicine
              </Button>
            </Link>
          </div>
        </div>

        <ul className={styles.featureList}>
          {FEATURES.map((feature) => (
            <li key={feature} className={styles.featureItem}>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section}`}>
        <h2>Reviews</h2>
        <p className={styles.sectionSubtitle}>Search for Medicine, Filter by your location</p>

        {reviewsStatus === 'loading' ? (
          <Loader />
        ) : (
          <div className={styles.reviewGrid}>
            {customerReviews.map((review) => (
              <ReviewCard key={review._id} variant="home" name={review.name} avatarUrl={review.avatarUrl} quote={review.quote} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
