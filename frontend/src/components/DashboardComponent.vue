<template>
  <div class="d-flex dashboard-wrapper">
    <v-navigation-drawer
      class="deep-purple accent-4 dashboard-drawer"
      dark
      permanent
    >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div class="d-flex-column dashboard-main">
      <!-- Headerbar -->
      <v-app-bar
        color="deep-purple accent-4"
        dark
      >
        <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
        <v-toolbar-title>DocManager</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="addNotif" icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <notifications-component></notifications-component>
        <user-profile-component></user-profile-component>
      </v-app-bar>

      <!-- Content -->
      <div class="d-flex dashboard-content"></div>

      <!-- Footer -->
      <v-footer 
        padless 
        color="deep-purple accent-4"
        dark
      >
        <v-col
          class="text-center"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-col>
      </v-footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserProfileComponent from "@/components/UserProfileComponent.vue";
import NotificationsComponent from "@/components/NotificationsComponent.vue";

@Component({
  name: "DashboardComponent",
  components: {
    UserProfileComponent,
    NotificationsComponent
  }
})
export default class DashboardComponent extends Vue {
  private items = [
    { title: "Dashboard", icon: "mdi-view-dashboard" },
    { title: "Account", icon: "mdi-account" },
    { title: "Admin", icon: "mdi-gavel" },
  ];
  private drawer = true;

  private addNotif() {
    this.$store.dispatch("addNotification", {message: "template notification", type: "warning", date: 1597387248687, status: "new"});
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .dashboard-wrapper {
    height: 100%; 
  }

  .dashboard-drawer {
    width: 240px !important;
  }

  .dashboard-main {
    height: 100%;
    width: calc(100% - 240px);
  }

  .dashboard-content {
    background-color: white; 
    height: calc(100% - 112px); 
    width: 100%
  }
</style>
