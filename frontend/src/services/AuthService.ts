import Api from "@/services/ApiService";

export default {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  register(credentials: unknown) {
    return Api().post("register", credentials);
  }
};
