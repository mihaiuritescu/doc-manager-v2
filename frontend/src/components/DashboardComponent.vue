<template>
  <div class="d-flex dashboard-wrapper">

    <v-navigation-drawer
      class="primary dashboard-drawer"
      dark
      permanent
    >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="switchContent(item.title)"
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
        color="primary"
        dark
        class="dashboard-headerbar"
      >
        <v-toolbar-title>DocManager</v-toolbar-title>
        <v-spacer></v-spacer>
        <notifications-component></notifications-component>
        <user-profile-component></user-profile-component>
      </v-app-bar>

      <!-- Content -->
      <widgets-component v-if="widgets"></widgets-component>
      <employees-component v-if="employees"></employees-component>
      <products-component v-if="products"></products-component>
      <documents-component v-if="documents"></documents-component>

      <!-- Footer -->
      <v-footer 
        padless 
        color="primary"
        dark
        class="dashboard-footer"
      >
        <v-col
          class="text-center"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong> DocManager</strong>
        </v-col>
      </v-footer>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserProfileComponent from "@/components/UserProfileComponent.vue";
import NotificationsComponent from "@/components/NotificationsComponent.vue";
import WidgetsComponent from "@/components/WidgetsComponent.vue";
import ProductsComponent from "@/components/ProductsComponent.vue";
import DocumentsComponent from "@/components/DocumentsComponent.vue";
import EmployeesComponent from "@/components/EmployeesComponent.vue";

@Component({
  name: "DashboardComponent",
  components: {
    UserProfileComponent,
    NotificationsComponent,
    WidgetsComponent,
    ProductsComponent,
    DocumentsComponent,
    EmployeesComponent
  }
})
export default class DashboardComponent extends Vue {
  private items = [
    { title: "Widgets", icon: "mdi-view-dashboard" },
    { title: "Employees", icon: "mdi-account" },
    { title: "Products", icon: "mdi-monitor" },
    { title: "Documents", icon: "mdi-file-document" },
  ];

  private widgets= true;
  private employees= false;
  private products= false;
  private documents= false;

  private switchContent(title: string): void {
    switch (title) {
    case "Widgets":
      this.widgets = true;
      this.employees = false;
      this.products = false;
      this.documents = false;
      break;
    case "Employees":
      this.widgets = false;
      this.employees = true;
      this.products = false;
      this.documents = false;
      break;
    case "Products":
      this.widgets = false;
      this.employees = false;
      this.products = true;
      this.documents = false;
      break;
    case "Documents":
      this.widgets = false;
      this.employees = false;
      this.products = false;
      this.documents = true;
      break;
    default:
      break;
    }
  }

}
</script>

<style lang="scss">
.dashboard-wrapper {
  height: 100%;
}

.dashboard-drawer {
  width: 240px !important;
  // box-shadow: 
  //   0 5px 5px -3px rgba(0, 0, 0, 0.2), 
  //   0 8px 10px 1px rgba(0, 0, 0, 0.14), 
  //   0 3px 14px 2px rgba(0, 0, 0, 0.12);
  box-shadow: 9px -2px 18px -8px rgba(0,0,0,0.65);
  z-index: 1;
}

.dashboard-headerbar {
  // box-shadow: 0px 10px 66px -12px rgba(0,0,0,0.65) !important;
  box-shadow: 5px 10px 18px -8px rgba(0,0,0,0.65) !important;
  z-index: 2 !important;
}

.dashboard-main {
  height: 100%;
  width: calc(100% - 240px);
}

.dashboard-footer {
  z-index: 2;
  box-shadow: 1px -6px 18px -8px rgba(0,0,0,0.65) !important;
}
</style>
