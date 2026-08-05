import { useEffect } from 'react';
import { StoreCard } from '../../components/StoreCard/StoreCard';
import { Loader } from '../../components/ui/Loader/Loader';
import { fetchStores } from '../../redux/stores/storesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './MedicineStorePage.module.css';

export function MedicineStorePage() {
  const dispatch = useAppDispatch();
  const { all: stores, status } = useAppSelector((state) => state.stores);

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  return (
    <div className={`container ${styles.page}`}>
      <h1>Medicine store</h1>

      {status === 'loading' && <Loader />}

      {status === 'succeeded' && stores.length === 0 && (
        <p className={styles.emptyState}>Nothing was found for your request</p>
      )}

      {status === 'succeeded' && stores.length > 0 && (
        <div className={styles.grid}>
          {stores.map((store) => (
            <StoreCard key={store._id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}
