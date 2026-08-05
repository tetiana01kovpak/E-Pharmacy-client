import { toast } from 'react-toastify';
import { addToCart } from '../redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { openAuthModal, setPendingCartAction } from '../redux/ui/uiSlice';

export function useAddToCart() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return async (productId: string, quantity = 1) => {
    if (!isLoggedIn) {
      dispatch(setPendingCartAction({ productId, quantity }));
      dispatch(openAuthModal('login'));
      return;
    }

    const result = await dispatch(addToCart({ productId, quantity }));
    if (addToCart.fulfilled.match(result)) {
      toast.success('Added to cart');
    } else {
      toast.error(result.payload ?? 'Failed to add item to cart');
    }
  };
}
