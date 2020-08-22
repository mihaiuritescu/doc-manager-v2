import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { Notification, User } from "@/types/appTypes";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: {} as User,
    isUserLoggedIn: false,
    notifications: [] as Notification[]
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isUserLoggedIn = !!(token);
    },
    setUser(state, user) {
      state.user = user;
    },
    addNotification(state, notification) {
      if(notification) {
        state.notifications.unshift(notification);
      }
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    markNotificationsAsRead(state) {
      if(state.notifications && state.notifications.length) {
        for(let i=0; i<state.notifications.length; i++) {
          state.notifications[i].status = "read";
        }
      }
    }
  },
  actions: {
    setToken({commit}, token) {
      commit("setToken", token);
    },
    setUser({commit}, user) {
      commit("setUser", user);
    },
    addNotification({commit}, notification) {
      commit("addNotification", notification);
    },
    clearNotifications({commit}) {
      commit("clearNotifications");
    },
    markNotificationsAsRead({commit}) {
      commit("markNotificationsAsRead");
    }
  }
});