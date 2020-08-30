import axios from "axios";
import store from "@/store/appStore";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => {
  return axios.create({
    baseURL: "http://localhost:8081/",
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  });
};
