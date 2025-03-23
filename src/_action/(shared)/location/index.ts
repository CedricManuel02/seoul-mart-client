"use server";

import { PSG_URL_ENPOINT } from "@/_constant/constant";
// GET PROVINCE SERVER ACTION
export async function getProvincesServerAction() {
  const response = await fetch(`${PSG_URL_ENPOINT}/provinces`);

  const data = await response.json();

  return data;
}

export async function getCitiesServerAction(province: string) {
  const response = await fetch(
    `${PSG_URL_ENPOINT}/provinces/${province}/cities`
  );

  const data = await response.json();

  return data;
}
export async function getBarangaysServerAction(cities: string) {
  const response = await fetch(`${PSG_URL_ENPOINT}/cities/${cities}/barangays`);

  const data = await response.json();

  return data;
}

