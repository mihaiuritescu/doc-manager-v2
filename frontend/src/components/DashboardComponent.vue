<template>
  <div class="d-flex dashboard-wrapper">

    <v-navigation-drawer
      class="d-flex primary dashboard-drawer"
      dark
      permanent
    >
      <div class="d-flex flex-column">
        <div class="dashboard-drawer-title">DocManager</div>
        <v-divider color="lightgray" ></v-divider>
        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :class="item.active ? 'dashboard-drawer-selected-item' : ''"
            :disabled="item.title !== 'Widgets' && !user.admin"
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
      </div>
      <div class="d-flex justify-center align-center dashboard-logout-container">
        <v-btn class="dashboard-logout-btn" @click="logout">Logout</v-btn>
      </div>
    </v-navigation-drawer>

    <div class="d-flex-column dashboard-main">
      
      <!-- Headerbar -->
      <v-app-bar
        dark
        class="dashboard-headerbar"
      >
        <v-toolbar-title class="dashboard-headerbar-title black--text">{{ activeTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <notifications-component></notifications-component>
        <user-profile-component></user-profile-component>
      </v-app-bar>

      <!-- Content -->
      <widgets-component v-if="widgets"></widgets-component>
      <employees-component v-if="employees"></employees-component>
      <products-component v-if="products"></products-component>
      <documents-component v-if="documents"></documents-component>

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
import { User } from "../types/appTypes";
import { mapState } from "vuex";

@Component({
  name: "DashboardComponent",
  computed: mapState(["user"]),
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
  private user!: User;
  private items = [
    { title: "Widgets", icon: "mdi-view-dashboard", active: true },
    { title: "Employees", icon: "mdi-account", active: false },
    { title: "Products", icon: "mdi-monitor", active: false },
    { title: "Documents", icon: "mdi-file-document", active: false },
  ];

  private widgets= true;
  private employees= false;
  private products= false;
  private documents= false;

  get activeTitle(): string {
    let result = "DocManager";
    this.items.forEach(item => {
      if (item.active === true) result = item.title;
    });
    return result;
  }

  private switchContent(title: string): void {
    switch (title) {
    case "Widgets":
      this.widgets = true;
      this.items[0].active = true;
      this.employees = false;
      this.items[1].active = false;
      this.products = false;
      this.items[2].active = false;
      this.documents = false;
      this.items[3].active = false;
      break;
    case "Employees":
      this.widgets = false;
      this.items[0].active = false;
      this.employees = true;
      this.items[1].active = true;
      this.products = false;
      this.items[2].active = false;
      this.documents = false;
      this.items[3].active = false;
      break;
    case "Products":
      this.widgets = false;
      this.items[0].active = false;
      this.employees = false;
      this.items[1].active = false;
      this.products = true;
      this.items[2].active = true;
      this.documents = false;
      this.items[3].active = false;
      break;
    case "Documents":
      this.widgets = false;
      this.items[0].active = false;
      this.employees = false;
      this.items[1].active = false;
      this.products = false;
      this.items[2].active = false;
      this.documents = true;
      this.items[3].active = true;
      break;
    default:
      break;
    }
  }

  private logout(): void {
    this.$store.commit("setToken", null);
    this.$store.commit("setUser", null);
    this.$store.commit("clearNotifications");
    this.$router.push("login");
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
  // box-shadow: 9px -2px 18px -8px rgba(0,0,0,0.65);
  z-index: 1;
}

.dashboard-drawer .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dashboard-drawer-title {
  color: white;
  font-size: 24px;
  font-weight: bold;
  width: 100%;
  padding: 16px;
}

.dashboard-drawer-selected-item {
  background-color: #ffffff4f;
}

.dashboard-logout-container {
  height: 75px;
  width: 100%;
}

.dashboard-logout-btn {
  width: 175px !important;
  background: #2e2d2d !important;
}

.dashboard-headerbar {
  // box-shadow: 0px 10px 66px -12px rgba(0,0,0,0.65) !important;
  // box-shadow: 5px 10px 18px -8px rgba(0,0,0,0.65) !important;
  // z-index: 2 !important;

  box-shadow: none !important;
  background-color: #eee !important;
  background: #eee !important;
  z-index: 0 !important;
}

.dashboard-headerbar-title {
  font-size: 24px !important;
  margin-left: 10px;
}

.dashboard-main {
  height: 100%;
  width: calc(100% - 240px);
}

.dashboard-footer {
  z-index: 2;
  // box-shadow: 1px -6px 18px -8px rgba(0,0,0,0.65) !important;
}
</style>
