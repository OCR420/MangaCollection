import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.89.23.133:3000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
