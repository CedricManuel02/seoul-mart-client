"use client";
import React, { useState } from "react";
import MapComponent from "./checkout-map";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { clearLocation, setLocation } from "@/_redux/features/location-slice";

export default function CheckoutMapContainer() {
  const dispatch = useDispatch();
  const [deliveryLocation, setDeliveryLocation] = useState<{
    lat: number;
    lng: number;
    province: string;
    cities: string;
    barangay: string;
  } | null>(null);

  function handleSelectLocation(
    setDeliveryLocation: (location: {
      lat: number;
      lng: number;
      province: string;
      cities: string;
      barangay: string;
    }) => void
  ) {
    return (lat: number, lng: number, province: string, cities: string, barangay: string) => {
      console.log("Selected Location:", { province, cities, barangay });

      setDeliveryLocation({ lat, lng, province, cities, barangay });

      dispatch(clearLocation());
      dispatch(
        setLocation({ location: { latitude: lat, longitude: lng, province, cities, barangay } })
      );

      toast({
        title: "Set location",
        description: `Location set: ${barangay}, ${cities}, ${province}`,
      });
    };
  }

  return (
    <section className="bg-white p-8 rounded shadow">
      <h3 className="font-semibold text-sm text-slate-900">Place an accurate pin</h3>
      <p className="text-slate-500 text-sm">
        We will deliver to your map location. Please check if it is correct, else click the map to adjust.
      </p>
      {deliveryLocation && (
        <p className="mb-4 text-sm text-green-600">
          Location set: {deliveryLocation.barangay}, {deliveryLocation.cities}, {deliveryLocation.province}
        </p>
      )}
      <MapComponent onSelectLocation={handleSelectLocation(setDeliveryLocation)} />
    </section>
  );
}
