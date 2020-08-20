import axios from "axios";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => {
  return axios.create({
    baseURL: "http://localhost:8081/"
  });
};
