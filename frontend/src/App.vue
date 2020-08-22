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
</style>

