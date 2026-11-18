import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.2.15:3000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
