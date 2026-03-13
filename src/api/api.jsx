import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

const uploadResume = async (formData) => {
  try {
    const response = await API.post("/resumes/", formData);
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
export default API;