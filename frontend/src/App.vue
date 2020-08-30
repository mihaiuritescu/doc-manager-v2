<template>
  <v-app class="app-background">
    <router-view />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  components: {},

  data: () => ({
    //
  })
});
</script>

<style lang="scss">
html {
  overflow: hidden !important;
}

.app-background {
  background-image: url("./assets/wp.jpg") !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}

.app-white-text {
  color: white;
}

.app-widget-icon {
  font-size: 100px !important;
  color: #ec662c !important;
}

::-webkit-scrollbar {
  height: 3px;
  width: 5px;
}
::-webkit-scrollbar-button {
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-track {
  background: #eee;
  border: thin solid lightgray;
  box-shadow: 0px 0px 3px #dfdfdf inset;
  border-radius: 9px;
}
::-webkit-scrollbar-thumb {
  background: #999;
  border: thin solid gray;
  border-radius: 9px;
}
::-webkit-scrollbar-thumb:hover {
  background: #7d7d7d;
}
</style>

