import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '../components/ui/Loader/Loader';
import { useAppSelector } from '../redux/hooks';

export function PrivateRoute() {
  const { isLoggedIn, isRefreshing } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isRefreshing) return <Loader />;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
