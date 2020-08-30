import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import RegisterComponent from "@/components/RegisterComponent.vue";
import LoginComponent from "@/components/LoginComponent.vue";
import DashboardComponent from "@/components/DashboardComponent.vue";
import store from "@/store/appStore";

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
    component: DashboardComponent,
    meta: {
      requiresAuth: true
    }
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.isUserLoggedIn) {
      next({ name: "Login" });
    } else {
      next(); // go to wherever I'm going
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});

export default router;
