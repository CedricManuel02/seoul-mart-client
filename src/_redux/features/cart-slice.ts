import { ICart, IProduct, IVariants } from "@/_interface/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ICart = {
  items: [],
  loading: false,
  selectedItems: [],
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    listItem: (
      state,
      action: PayloadAction<{cart_id: string; cart_item_quantity: number; tbl_products: IProduct; tbl_variants: IVariants;}>) => {
      const { cart_id, tbl_products, tbl_variants, cart_item_quantity } = action.payload;

      const isExisting = state.items.find((cart) => cart.cart_id === cart_id);

      if (!isExisting) {
        state.items.push({
          cart_id,
          tbl_products,
          tbl_variants,
          cart_item_quantity,
        });
      }

      state.totalPrice = 0;
    },
    removeItem: (state, action: PayloadAction<{ cart_id: string }>) => {
      const cartItemToRemove = state.items.find((cart) => cart.cart_id === action.payload.cart_id);
      if (cartItemToRemove) {
        const variantPrice = cartItemToRemove.tbl_variants.variant_price || 0;
        state.totalPrice -= cartItemToRemove.cart_item_quantity * variantPrice;
        state.items = state.items.filter((cart) => cart.cart_id !== action.payload.cart_id);
      }
    },
    incrementQuantity: (state, action: PayloadAction<{ cart_id: string }>) => {
      const { cart_id } = action.payload;
      const cartItem = state.items.find((cart) => cart.cart_id === cart_id);

      if (cartItem && cartItem.cart_item_quantity < cartItem.tbl_variants.variant_stocks) {
        cartItem.cart_item_quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ cart_id: string }>) => {
      const { cart_id } = action.payload;
      const cartItem = state.items.find((cart) => cart.cart_id === cart_id);

      if (cartItem && cartItem.cart_item_quantity > 1) {
        cartItem.cart_item_quantity -= 1;
      }
    },
    addSelectedItems: (state, action: PayloadAction<{ cart_id: string }>) => {
      const { cart_id } = action.payload;
      const isExisting = state.selectedItems.find((cart) => cart.cart_id === cart_id);
      if (!isExisting) {
        const cart = state.items.find((cart) => cart.cart_id === cart_id);
        if (cart) {
          state.selectedItems.push({
            cart_id: cart_id,
            tbl_products: cart?.tbl_products,
            tbl_variants: cart?.tbl_variants,
            cart_item_quantity: cart?.cart_item_quantity,
          });
        }
      }
    },
    removeSelectedItems: (state, action: PayloadAction<{ cart_id: string }>) => {
      const { cart_id } = action.payload;
      state.selectedItems = state.selectedItems.filter((cart) => cart.cart_id !== cart_id);
    },
    calculateTotal: (state) => {
      state.totalPrice = 0;
      state.selectedItems.forEach((selectedItem) => {
        const isExisting = state.items.find((cart) => cart.cart_id === selectedItem.cart_id);
        if (isExisting) {
          if (isExisting.tbl_variants.tbl_variant_item.length > 0 && isExisting.tbl_variants.tbl_variant_item[0].tbl_discount?.discount_percentage) {
            state.totalPrice += ((isExisting.tbl_variants.variant_price - (isExisting.tbl_variants.variant_price * isExisting.tbl_variants.tbl_variant_item[0].tbl_discount?.discount_percentage) / 100)) * isExisting.cart_item_quantity;
          } else {
            state.totalPrice += isExisting.tbl_variants.variant_price * isExisting.cart_item_quantity;
          }

        }
      });
    },
    clearSelectedItems: (state) => {
      state.selectedItems = []; 
    },
    updateCheckoutItem: (state, action: PayloadAction<{product_id: string; quantity: number;}>)=> {
      const {product_id, quantity} = action.payload;
      const isExisting = state.selectedItems.find((item) => item.tbl_products?.product_id === product_id);
      if(isExisting) {
        isExisting.cart_item_quantity = quantity;
      }
    },
    setLoading: (state) => {
      state.loading = !state.loading;
    },
  
    clearItem: (state) => {
      state.items = [];
    }
  },
});

export const { listItem, setLoading, clearItem, removeItem, incrementQuantity, decrementQuantity, calculateTotal, removeSelectedItems, addSelectedItems, updateCheckoutItem,clearSelectedItems } = cartSlice.actions;

export default cartSlice.reducer;
