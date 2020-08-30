import Vue from "vue";
import Vuetify from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

const lightTheme = {
  primary: "#4caf50",
  // secondary: "#ec662c",
  secondary: "#4caf50",
  accent: "#087f24",
  error: "#f44336",
  warning: "#ff9800",
  info: "#2196f3",
  success: "#4caf50",
  text: "#ffffff"
};

export default new Vuetify({
  theme: {
    themes: {
      light: lightTheme
    },
  },
  icons: {
    iconfont: "mdi",
  },
});
