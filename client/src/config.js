// export const BASE_URL = "https://inventory-2-kx8p.onrender.com"



// export const BASE_URL1 = "http://localhost:5000"
// export const BASE_URL = "http://localhost:5000";


// // config.js ✅ FINAL
// export const BASE_URL = "http://localhost:5000";


// // config.js
// export const BASE_URL = import.meta.env.PROD
//   ? "https://votingapp-backend-t10i.onrender.com" // Render production
//   : "http://localhost:5000/api";                      // Local dev


// export const BASE_URL = import.meta.env.PROD
//   ? "https://votingapp-backend-t10i.onrender.com/api" // production backend
//   : "http://localhost:5000/api";                      // local dev



// export const BASE_URL = import.meta.env.PROD
//   ? import.meta.env.VITE_API_URL
//   : "http://localhost:5000/api";


export const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5000";


// // config.js
// export const BASE_URL = import.meta.env.VITE_API_URL;
