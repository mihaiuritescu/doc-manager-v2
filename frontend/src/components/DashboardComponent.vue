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
      <div class="d-flex dashboard-content">

        <grid-layout
          :layout.sync="layout"
          :col-num="8"
          :col="{ lg: 8, md: 6, sm: 6, xs: 4, xxs: 2 }"
          :row-height="175"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[15, 15]"
          :use-css-transforms="true"
          class="dashboard-grid"
        >
          <grid-item 
            v-for="item in layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            class="d-flex align-center justify-center dashboard-grid-widget"
          >
            <component v-if="item.comp" :is="item.comp" :key="item.i"></component>
            <div v-else> {{item.i}} </div>
          </grid-item>
        </grid-layout>

      </div>

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
import HolidayRequestComponent from "@/components/HolidayRequestComponent.vue";
import ReportComponent from "@/components/ReportComponent.vue";
import SupplierComponent from "@/components/SupplierComponent.vue";
import ProductComponent from "@/components/ProductComponent.vue";
import VueGridLayout from "vue-grid-layout";

@Component({
  name: "DashboardComponent",
  components: {
    UserProfileComponent,
    NotificationsComponent,
    HolidayRequestComponent,
    ReportComponent,
    ProductComponent,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  }
})
export default class DashboardComponent extends Vue {
  private items = [
    { title: "Dashboard", icon: "mdi-view-dashboard" },
    { title: "Account", icon: "mdi-account" },
    { title: "Admin", icon: "mdi-gavel" },
  ];
  private drawer = true;
  private layout = [
    {"x":0,"y":0,"w":2,"h":1,"i":"0", comp: HolidayRequestComponent},
    {"x":2,"y":0,"w":2,"h":1,"i":"1", comp: ReportComponent},
    {"x":4,"y":0,"w":2,"h":1,"i":"2", comp: SupplierComponent},
    {"x":6,"y":0,"w":2,"h":1,"i":"3", comp: ProductComponent},
    {"x":0,"y":1,"w":2,"h":2,"i":"4"},
    {"x":2,"y":1,"w":2,"h":2,"i":"5"},
  ];

  private addNotif() {
    this.$store.dispatch("addNotification", 
      { message: "template notificationtemplate notificationtemplate", 
        type: "warning", 
        date: 1597387248687, 
        status: "new"
      });
  }
}
</script>

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
  width: 100%;
  max-height: 1185px;
  overflow: auto;
  padding: 10px;
}

.dashboard-grid {
  height: 100%;
  width: 100%;
}

.dashboard-grid-widget {
  padding: 10px;
  background-color: white;
  border: solid 1px lightgrey;
  box-shadow: 
    0 5px 5px -3px rgba(0,0,0,.2), 
    0 8px 10px 1px rgba(0,0,0,.14), 
    0 3px 14px 2px rgba(0,0,0,.12);
  border-radius: 4px;
}
</style>
