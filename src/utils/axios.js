import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.imgur.com/3/",
  proxy: {
    host: "http://localhost",
    port: 3000, // or the port number of your proxy server
  },
});

export default axiosInstance;
