import axios from "axios";

let server = axios.create({
  baseURL: `${process.env.VUE_APP_SERVER_PATH}/api`,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

export default server;