import { Navigate, Route, Routes } from 'react-router-dom';
import { SharedLayout } from '../layouts/SharedLayout/SharedLayout';
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout';
import { HomePage } from '../pages/HomePage/HomePage';
import { MedicineStorePage } from '../pages/MedicineStorePage/MedicineStorePage';
import { MedicinePage } from '../pages/MedicinePage/MedicinePage';
import { ProductPage } from '../pages/ProductPage/ProductPage';
import { CartPage } from '../pages/CartPage/CartPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { PrivateRoute } from './PrivateRoute';
import { RestrictedRoute } from './RestrictedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<SharedLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/medicine-store" element={<MedicineStorePage />} />
        <Route path="/product/:id" element={<ProductPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/medicine" element={<MedicinePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Route>

      <Route element={<RestrictedRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
