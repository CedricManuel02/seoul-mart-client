import { ILocation } from "@/_interface/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ILocation = {
    longitude: 0,
    latitude: 0,
    province: "",
    cities: "",
    barangay: "",
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{ location: ILocation }>) => {
        const {longitude, latitude, province, cities, barangay} = action.payload.location;
        state.cities = cities;
        state.latitude = latitude;
        state.province = province;
        state.barangay = barangay;
        state.longitude = longitude;
    },
    clearLocation: (state) => {
        state.longitude = 0;
        state.latitude = 0;
        state.province = "";
        state.cities = "";
        state.barangay = "";
    },
  },
});

// Export actions
export const { setLocation, clearLocation } = locationSlice.actions;
 
// Export reducer
export default locationSlice.reducer;
