const API_URL: string =
  import.meta.env.PROD
    ? "http://steamdeck-ip/backend/api"
    : "http://localhost:8000/api";

export default API_URL;
