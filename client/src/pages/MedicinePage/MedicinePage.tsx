import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Select } from '../../components/ui/Select/Select';
import { TextField } from '../../components/ui/TextField/TextField';
import { Button } from '../../components/ui/Button/Button';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import { Loader } from '../../components/ui/Loader/Loader';
import { fetchCategories, fetchProducts } from '../../redux/products/productsSlice';
import type { ProductsQuery } from '../../redux/products/productsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useAddToCart } from '../../hooks/useAddToCart';
import styles from './MedicinePage.module.css';

export function MedicinePage() {
  const dispatch = useAppDispatch();
  const handleAddToCart = useAddToCart();
  const [searchParams] = useSearchParams();

  const { items, page, totalPages, status, categories } = useAppSelector((state) => state.products);

  const [categoryInput, setCategoryInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState<ProductsQuery>({
    page: 1,
    minDiscount: searchParams.get('minDiscount') ? Number(searchParams.get('minDiscount')) : undefined,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(query));
  }, [dispatch, query]);

  const handleFilter = () => {
    setQuery((prev) => ({
      ...prev,
      category: categoryInput || undefined,
      search: searchInput || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1>Medicine</h1>

      <div className={styles.filterBar}>
        <Select
          label="Product category"
          name="category"
          placeholder="Product category"
          value={categoryInput}
          onChange={(event) => setCategoryInput(event.target.value)}
          options={categories.map((category) => ({ value: category, label: category }))}
        />
        <TextField
          label="Search medicine"
          name="search"
          placeholder="Search medicine"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <Button onClick={handleFilter} className={styles.filterBtn}>
          Filter
        </Button>
      </div>

      {status === 'loading' && <Loader />}

      {status === 'succeeded' && items.length === 0 && (
        <p className={styles.emptyState}>Nothing was found for your request</p>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <>
          <div className={styles.grid}>
            {items.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
