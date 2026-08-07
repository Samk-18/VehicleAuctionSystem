import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const addCar = async (car, images) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append(
    "carData",
    new Blob([JSON.stringify(car)], {
      type: "application/json"
    })
  );

  if (images && images.length > 0) {
    Array.from(images).forEach((file) => {
      formData.append("images", file);
    });
  }

  return axios.post(
    `${API_BASE_URL}/api/cars/add`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
