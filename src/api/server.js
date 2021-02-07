import axios from "axios";
import store from "@/store/store";
import router from "@/router/router";
import redirectService from '@/services/redirect.service';


let server = axios.create({
  baseURL: `${process.env.VUE_APP_SERVER_PATH}/api`,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

server.interceptors.response.use(responseErrorHandler);

async function responseErrorHandler(error) {
  if (Object.prototype.hasOwnProperty.call(error, "response") &&
    Object.prototype.hasOwnProperty.call(error.response, "status")) {
    if (error.response.status === 401) {
      try {
        await store.dispatch("auth/logout");
        if (router.history.current.name !== "login") {
          redirectService.setRedirectPath(router.currentRoute.path)
          await router.push("/login");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  return Promise.reject(error)
}


server.interceptors.request.use(config => {
  const token = store.state.auth.token;
  if (token) {
    config.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return config;

});


export default server;