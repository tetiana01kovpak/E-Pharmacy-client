import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import type { FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { CartLineItem } from '../../components/CartLineItem/CartLineItem';
import { TextField } from '../../components/ui/TextField/TextField';
import { Button } from '../../components/ui/Button/Button';
import { Loader } from '../../components/ui/Loader/Loader';
import { checkout, fetchCart, removeCartItem, updateCartItem } from '../../redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { shippingSchema } from '../../utils/validationSchemas/cartSchemas';
import type { ShippingValues } from '../../utils/validationSchemas/cartSchemas';
import type { PaymentMethod } from '../../types';
import styles from './CartPage.module.css';

type CheckoutValues = ShippingValues & { paymentMethod: PaymentMethod };

const initialValues: CheckoutValues = { name: '', email: '', phone: '', address: '', paymentMethod: 'COD' };

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, status, isMutating } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleSubmit = async (values: CheckoutValues, helpers: FormikHelpers<CheckoutValues>) => {
    const { paymentMethod, ...shipping } = values;
    const result = await dispatch(checkout({ shipping, paymentMethod }));
    if (checkout.fulfilled.match(result)) {
      toast.success('Order placed successfully!');
      navigate('/home');
    } else {
      toast.error(result.payload ?? 'Failed to place order');
      helpers.setSubmitting(false);
    }
  };

  if (status === 'loading') return <Loader />;

  return (
    <div className={`container ${styles.page}`}>
      <h1>Cart</h1>

      <div className={styles.layout}>
        <Formik
          initialValues={{ ...initialValues, name: user?.name ?? '', email: user?.email ?? '' }}
          validationSchema={shippingSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, handleChange, handleBlur, touched, errors, isSubmitting, setFieldValue }) => (
            <Form className={styles.shippingCard} noValidate>
              <h2>Enter shipping info</h2>
              <p className={styles.helperText}>
                Enter your shipping info where you&apos;ll get the product. You can also send any other location
                where you need the products.
              </p>

              <div className={styles.fieldsGrid}>
                <TextField
                  label="Name"
                  name="name"
                  placeholder="Enter text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name ? errors.name : undefined}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter text"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : undefined}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter text"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone ? errors.phone : undefined}
                />
                <TextField
                  label="Address"
                  name="address"
                  placeholder="Enter text"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.address ? errors.address : undefined}
                />
              </div>

              <hr className={styles.divider} />

              <h2>Payment method</h2>
              <p className={styles.helperText}>You can pay us in a multiple way in our payment gateway system.</p>

              <div className={styles.paymentOptions}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={values.paymentMethod === 'COD'}
                    onChange={() => setFieldValue('paymentMethod', 'COD')}
                  />
                  Cash On Delivery
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={values.paymentMethod === 'BANK'}
                    onChange={() => setFieldValue('paymentMethod', 'BANK')}
                  />
                  Bank
                </label>
              </div>

              <hr className={styles.divider} />

              <h2>Order details</h2>
              <p className={styles.helperText}>
                Shipping and additional costs are calculated based on values you have entered.
              </p>

              <div className={styles.totalRow}>
                <span>Total:</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>

              <Button type="submit" fullWidth disabled={isSubmitting || items.length === 0}>
                {isSubmitting ? 'Placing order...' : 'Place order'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className={styles.itemsCard}>
          {items.length === 0 ? (
            <p className={styles.emptyState}>Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <CartLineItem
                key={item.productId}
                item={item}
                onQuantityChange={(productId, quantity) => {
                  if (!isMutating) dispatch(updateCartItem({ productId, quantity }));
                }}
                onRemove={(productId) => {
                  if (!isMutating) dispatch(removeCartItem(productId));
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
