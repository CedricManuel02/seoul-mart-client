"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "@/_constant/constant";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapComponent({
  onSelectLocation,
}: {
  onSelectLocation?: (lat: number, lng: number, province: string, city: string, barangay: string) => void;
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // Initialize Map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [121.02, 14.60], // Default to Metro Manila
      zoom: 12,
    });

    // Click to select location
    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker({ color: "red" })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setText("Selected Location"))
          .addTo(mapRef.current!);
      }

      // Fetch province, city, and barangay using reverse geocoding
      const { province, city, barangay } = await getLocationDetails(lat, lng);

      if (onSelectLocation) onSelectLocation(lat, lng, province, city, barangay);
    });

    return () => mapRef.current?.remove();
  }, []);

  return <div className="rounded border" ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />;
}

// Function to get province, city, and barangay using Mapbox Geocoding API
async function getLocationDetails(lat: number, lng: number): Promise<{ province: string; city: string; barangay: string }> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    const data = await response.json();

    const provinceFeature = data.features.find((feature: any) => feature.place_type.includes("region"));
    const cityFeature = data.features.find((feature: any) => feature.place_type.includes("place"));
    const barangayFeature = data.features.find((feature: any) =>
      feature.place_type.includes("locality") || feature.place_type.includes("neighborhood")
    );

    return {
      province: provinceFeature ? provinceFeature.text : "Unknown Province",
      city: cityFeature ? cityFeature.text : "Unknown City",
      barangay: barangayFeature ? barangayFeature.text : "Unknown Barangay",
    };
  } catch (error) {
    console.error("Error fetching location details:", error);
    return { province: "Unknown Province", city: "Unknown City", barangay: "Unknown Barangay" };
  }
}
