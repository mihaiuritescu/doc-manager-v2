import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import RegisterComponent from "@/components/RegisterComponent.vue";
import LoginComponent from "@/components/LoginComponent.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Register",
    component: RegisterComponent
  },
  {
    path: "/login",
    name: "Login",
    component: LoginComponent
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
