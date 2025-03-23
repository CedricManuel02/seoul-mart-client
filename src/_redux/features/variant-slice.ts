import { IVariantCreate, IVariantCreateModal } from "@/_interface/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IVariantCreate = {
  variant: [],
  loading: false,
};

export const variantSlice = createSlice({
  name: "variant",
  initialState,
  reducers: {
    addVariant: (state, action: PayloadAction<{ variant: IVariantCreateModal }>) => {
      state.variant.push(action.payload.variant);
    },
    updateVariant: (
      state,
      action: PayloadAction<{ index: number; values: Partial<IVariantCreateModal> }>
    ) => {
      const { index, values } = action.payload;
      if (state.variant[index]) {
        state.variant[index] = { ...state.variant[index], ...values };
      }
    },
    removeVariant: (state, action: PayloadAction<number>) => {
      state.variant.splice(action.payload, 1);
    },
    clearVariants: (state) => {
        state.variant = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

// Export actions
export const { addVariant, updateVariant, removeVariant, clearVariants, setLoading } = variantSlice.actions;
 
// Export reducer
export default variantSlice.reducer;
