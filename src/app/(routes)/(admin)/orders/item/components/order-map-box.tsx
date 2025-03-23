"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "@/_constant/constant";
import { IMapBox } from "@/_interface/interface";
import "mapbox-gl/dist/mapbox-gl.css"; 

export default function MapComponent({start, destination, barangay}: IMapBox) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // Initialize Map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
    });

    // Fit map to show both start and destination
    mapRef.current.fitBounds([start, destination], {
      padding: 50, // Add padding for better visibility
      maxZoom: 16, // Prevent zooming in too much
      duration: 1000, // Smooth animation
    });

    // Add Start Marker (Blue)
    new mapboxgl.Marker({ color: "blue" })
      .setLngLat(start)
      .setPopup(new mapboxgl.Popup().setText("Bella & Pepper Location"))
      .addTo(mapRef.current);

    // Add Destination Marker (Red)
    new mapboxgl.Marker({ color: "red" })
      .setLngLat(destination)
      .setPopup(new mapboxgl.Popup().setText(barangay))
      .addTo(mapRef.current);

    // Fetch and Display Route
    const getRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

      const response = await fetch(url);
      const data = await response.json();
      const route = data.routes[0]?.geometry;

      if (route && mapRef.current) {
        mapRef.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        });

        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#1db7dd",
            "line-width": 5,
          },
        });
      }
    };

    mapRef.current.on("load", getRoute);

    return () => {
      mapRef.current?.remove();
    };
  }, [start, destination]);

  return (
    <div className="rounded border" ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />
  );
}
