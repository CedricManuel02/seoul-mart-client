import { ICheckout, ICheckoutArray, IProduct, IVariants } from "@/_interface/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const currentState: ICheckout = {
  cart_id: "",
  tbl_products: {} as IProduct,
  tbl_variants: {} as IVariants,
  quantity: 0,
};

const initialState: ICheckoutArray = {
  item: [currentState],
  totalPrice: 0,
  shippingFee: 0,
  shippingDays: 0,
  shippingLoading: false,
};

export const cartSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addCheckoutItem: (
      state,
      action: PayloadAction<{
        cart_id: string,
        tbl_products: IProduct;
        tbl_variants: IVariants;
        quantity: number;
      }>
    ) => {
      const { cart_id, tbl_products, tbl_variants, quantity } = action.payload;
      const itemExists = state.item.find((item) => item.tbl_variants?.variant_id === tbl_variants.variant_id);
      if(!itemExists) {
        state.item.push({
          cart_id,
          tbl_products,
          tbl_variants,
          quantity,
        });
      }
    },
    clearCheckoutItem: (state) => {
      state.item = [];
    },
    removeCheckoutItem: (state, action: PayloadAction<{variant_id: string;}>) => {
      const {variant_id} = action.payload;
      state.item = state.item.filter((item) => item.tbl_variants?.variant_id !== variant_id)
    },
    clearCheckoutTotal: (state) => {
      state.totalPrice = 0;
    },
    calculateCheckoutTotal: (state) => {
      state.totalPrice = state.item.reduce((total, currentItem) => {
        if (currentItem.tbl_variants) {
          const price = currentItem.tbl_variants.variant_price;
          const discount = currentItem.tbl_variants.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage || 0;
          const discountedPrice = price - (price * discount) / 100;
          return total + discountedPrice * currentItem.quantity;
        }
        return total;
      }, 0);

    },
    updateCheckoutQuantity: (state, action: PayloadAction<{cart_id: string, quantity: number}>) => {
      const {cart_id, quantity} = action.payload;
      const item = state.item.find((item) => item.cart_id === cart_id);

      if (item) {
        item.quantity = quantity;
      }
     
    },
    setShippingLoading: (state) => {
      state.shippingLoading = !state.shippingLoading;
    },
    setShippingFee: (state, action: PayloadAction<{shipping_rate: number, shipping_days: number}>) => {
      state.shippingFee = action.payload.shipping_rate;
      state.shippingDays = action.payload.shipping_days;
    },
    resetShippingFee: (state) => {
      state.shippingFee = 0;
      state.shippingDays = 0;
    },
    addSingleCheckoutItem: (state, action: PayloadAction<{ tbl_products: IProduct; tbl_variants: IVariants; quantity: number;}>) => {
        const { tbl_products, tbl_variants, quantity } = action.payload;
        const itemExists = state.item.find((item) => item.tbl_variants?.variant_id === tbl_variants.variant_id);
        if(!itemExists) {
          state.item.push({
            cart_id: null,
            tbl_products,
            tbl_variants,
            quantity,
          });
        }
      },
  },
});

// Export actions
export const {addSingleCheckoutItem, setShippingLoading, setShippingFee, resetShippingFee, addCheckoutItem, clearCheckoutItem, calculateCheckoutTotal, removeCheckoutItem, clearCheckoutTotal, updateCheckoutQuantity } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
