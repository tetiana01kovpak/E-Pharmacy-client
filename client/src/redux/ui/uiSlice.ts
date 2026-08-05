import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AuthModalVariant = 'login' | 'register';

type PendingCartAction = {
  productId: string;
  quantity: number;
};

type UiState = {
  isAuthModalOpen: boolean;
  authModalVariant: AuthModalVariant;
  pendingCartAction: PendingCartAction | null;
};

const initialState: UiState = {
  isAuthModalOpen: false,
  authModalVariant: 'login',
  pendingCartAction: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal(state, action: PayloadAction<AuthModalVariant | undefined>) {
      state.isAuthModalOpen = true;
      if (action.payload) state.authModalVariant = action.payload;
    },
    closeAuthModal(state) {
      state.isAuthModalOpen = false;
      state.pendingCartAction = null;
    },
    setAuthModalVariant(state, action: PayloadAction<AuthModalVariant>) {
      state.authModalVariant = action.payload;
    },
    setPendingCartAction(state, action: PayloadAction<PendingCartAction>) {
      state.pendingCartAction = action.payload;
    },
    clearPendingCartAction(state) {
      state.pendingCartAction = null;
    },
  },
});

export const { openAuthModal, closeAuthModal, setAuthModalVariant, setPendingCartAction, clearPendingCartAction } =
  uiSlice.actions;
export default uiSlice.reducer;
