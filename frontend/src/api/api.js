import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// --- 1. ATTACH TOKEN TO EVERY REQUEST ---
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. HANDLE EXPIRED TOKENS (SECURITY) ---
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 (Unauthorized), the token is invalid/expired
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_details");
      
      // Force a redirect to login if we aren't already there
      if (globalThis.location.pathname !== "/login") {
        globalThis.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const uploadResume = async (formData) => {
  try {
    // Note: No need to pass headers here anymore! 
    // The interceptor above handles it automatically.
    const response = await API.post("/resumes/", formData);
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};


// --- PROFILE ACTIONS ---

export const getProfile = async () => {
  const response = await API.get("/manage-account/");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await API.put("/manage-account/", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await API.post("/update-password/", data);
  return response.data;
};


export default API;