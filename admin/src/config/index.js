let api = {
  pre: {
    BASE_API: import.meta.env.VITE_APP_BASE_API || "http://localhost:9081",
  },
  prd: {
    BASE_API: import.meta.env.VITE_APP_BASE_API || "http://localhost:9081",
  },
};
const env = "pre";

export default api[env];
