// export const BASE_URL = import.meta.env.PROD
//   ? import.meta.env.VITE_API_URL
//   : "http://localhost:5000/api";


export const BASE_URL = import.meta.env.VITE_API_URL;


if (!BASE_URL) {
throw new Error("VITE_API_URL is not defined");
}



