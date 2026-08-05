import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '../components/ui/Loader/Loader';
import { useAppSelector } from '../redux/hooks';

export function RestrictedRoute() {
  const { isLoggedIn, isRefreshing } = useAppSelector((state) => state.auth);

  if (isRefreshing) return <Loader />;

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
