import { useEffect } from 'react'
import { AppRouter } from './routes/AppRouter'
import { refreshUser } from './redux/auth/authSlice'
import { fetchCart } from './redux/cart/cartSlice'
import { useAppDispatch, useAppSelector } from './redux/hooks'

function App() {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  useEffect(() => {
    dispatch(refreshUser())
  }, [dispatch])

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart())
    }
  }, [isLoggedIn, dispatch])

  return <AppRouter />
}

export default App
