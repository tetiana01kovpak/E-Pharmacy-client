import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { AuthRequiredModal } from '../../components/AuthRequiredModal/AuthRequiredModal';

export function SharedLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AuthRequiredModal />
    </>
  );
}
