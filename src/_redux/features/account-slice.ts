import { IAccount } from "@/_interface/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IAccount = {
   user_id: "",
   user_name: "",
   user_email: "",
   user_profile: "",
   user_phone: "",
   roles: ""
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<IAccount>) => {
        const {user_id,roles, user_name, user_email, user_profile, user_phone} = action.payload;
        state.user_id = user_id;
        state.roles = roles;
        state.user_name = user_name;
        state.user_email = user_email;
        state.user_profile = user_profile;
        state.user_phone = user_phone;
    },
    signOut: (state) => {
        state.user_id = "";
        state.roles = "";
        state.user_name = "";
        state.user_email = "";
        state.user_profile = "";
        state.user_phone = "";
    },
  },
});

// Export actions
export const { signIn, signOut } = accountSlice.actions;
 
// Export reducer
export default accountSlice.reducer;
