import { createSelector, createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  apiAddToCart,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiClearCart,
  apiGetCart,
  CartItemPayload,
} from "@/lib/api/cart";

type CartItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

type InitialState = {
  items: CartItem[];
  synced: boolean;
};

const initialState: InitialState = {
  items: [],
  synced: false,
};

export const loadCartFromDB = createAsyncThunk(
  "cart/loadFromDB",
  async () => {
    return await apiGetCart();
  }
);

export const addItemToCartAsync = createAsyncThunk(
  "cart/addItemAsync",
  async (item: CartItem, { getState }) => {
    const state = getState() as RootState;
    const existing = state.cartReducer.items.find((i) => i.id === item.id);
    const quantity = existing ? item.quantity : item.quantity;
    await apiAddToCart(item.id, quantity);
    return item;
  }
);

export const updateCartItemQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async ({ id, quantity }: { id: number; quantity: number }) => {
    await apiUpdateCartItem(id, quantity);
    return { id, quantity };
  }
);

export const removeItemFromCartAsync = createAsyncThunk(
  "cart/removeItemAsync",
  async (id: number) => {
    await apiRemoveCartItem(id);
    return id;
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearAsync",
  async () => {
    await apiClearCart();
  }
);

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, price, quantity, discountedPrice, imgs } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, title, price, quantity, discountedPrice, imgs });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) existing.quantity = quantity;
    },
    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.synced = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartFromDB.fulfilled, (state, action) => {
        state.items = action.payload as CartItem[];
        state.synced = true;
      })
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        const { id, title, price, quantity, discountedPrice, imgs } = action.payload;
        const existing = state.items.find((item) => item.id === id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          state.items.push({ id, title, price, quantity, discountedPrice, imgs });
        }
      })
      .addCase(updateCartItemQuantityAsync.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const existing = state.items.find((item) => item.id === id);
        if (existing) existing.quantity = quantity;
      })
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  setCartItems,
} = cart.actions;

export default cart.reducer;
