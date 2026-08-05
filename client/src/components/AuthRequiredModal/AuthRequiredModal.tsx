import { toast } from 'react-toastify';
import { Modal } from '../ui/Modal/Modal';
import { LoginForm } from '../LoginForm/LoginForm';
import { RegisterForm } from '../RegisterForm/RegisterForm';
import { addToCart } from '../../redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearPendingCartAction, closeAuthModal, setAuthModalVariant } from '../../redux/ui/uiSlice';
import styles from './AuthRequiredModal.module.css';

export function AuthRequiredModal() {
  const dispatch = useAppDispatch();
  const { isAuthModalOpen, authModalVariant, pendingCartAction } = useAppSelector((state) => state.ui);

  const handleClose = () => dispatch(closeAuthModal());

  const handleSuccess = async () => {
    if (pendingCartAction) {
      const result = await dispatch(addToCart(pendingCartAction));
      if (addToCart.fulfilled.match(result)) {
        toast.success('Added to cart');
      } else {
        toast.error(result.payload ?? 'Failed to add item to cart');
      }
      dispatch(clearPendingCartAction());
    }
    dispatch(closeAuthModal());
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleClose}
      ariaLabel={authModalVariant === 'login' ? 'Log in to your account' : 'Sign up'}
    >
      {authModalVariant === 'login' ? (
        <div className={styles.content}>
          <h2 className={styles.heading}>Log in to your account</h2>
          <p className={styles.subtext}>Please login to your account before continuing.</p>
          <LoginForm onSuccess={handleSuccess} />
          <p className={styles.switchLink}>
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => dispatch(setAuthModalVariant('register'))}>
              Sign up
            </button>
          </p>
        </div>
      ) : (
        <div className={styles.content}>
          <h2 className={styles.heading}>Sign Up</h2>
          <p className={styles.subtext}>Before proceeding, please register on our site.</p>
          <RegisterForm submitLabel="Sign Up" compact onSuccess={handleSuccess} />
          <p className={styles.switchLink}>
            Already have an account?{' '}
            <button type="button" onClick={() => dispatch(setAuthModalVariant('login'))}>
              Log in
            </button>
          </p>
        </div>
      )}
    </Modal>
  );
}
