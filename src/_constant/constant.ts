import { config } from 'dotenv';
config();

export const DEFAULT_ICON_SIZE = 20;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT_URL!;

export const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiY2VkcmljMjAwMiIsImEiOiJjbTdsZnVkbXIwYXJxMmtvaXRvMjlucjF6In0.U57ek694oSJrx2g4p3c4FA";
 
export const PSG_URL_ENPOINT = "https://psgc.cloud/api"


export const CREATED_STATUS_CODE = 201;
export const OK_STATUS_CODE = 200;