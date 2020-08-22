import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import RegisterComponent from "@/components/RegisterComponent.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import DashboardComponent from "@/components/DashboardComponent.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Login",
    component: LoginComponent
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardComponent
  },
  {
    path: "/login",
    name: "Login",
    component: LoginComponent
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterComponent
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
