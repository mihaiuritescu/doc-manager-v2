<template>
  <v-menu
    :close-on-content-click="false"
    offset-y
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <div
        class="notifications-badge-and-bell-container"
        v-bind="attrs"
        v-on="on"
        @click="markAsRead"
      >
        <v-badge
          :color="badgeColor"
          :content="notificationsCount"
          :value="notificationsCount"
          bordered
          overlap
        >
          <v-icon class="notifications-bell-icon">mdi-bell-outline</v-icon>
        </v-badge>
      </div>
    </template>
    <v-card class="notifications-panel-card">
      <v-card-title>Notifications</v-card-title>
      <div class="notifications-panel-content">
        <v-card flat tile class="notifications-panel-list">
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(notification, index) in notifications"
              :key="index"
              class="notifications-list-item"
            >
              <v-list-item-avatar>
                <v-icon v-if="notification && notification.type === 'info'" color="blue"
                  >mdi-information</v-icon
                >
                <v-icon
                  v-if="notification && notification.type === 'warning'"
                  color="orange"
                  >mdi-alert</v-icon
                >
                <v-icon v-if="notification && notification.type === 'error'" color="red"
                  >mdi-alert-circle</v-icon
                >
              </v-list-item-avatar>
              <v-list-item-content class="d-flex">
                <v-list-item-title @click="toggleListItem">
                  {{ notification.message }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ moment(notification.date).fromNow() }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <div
              v-if="notifications.length === 0"
              class="notifications-no-notifications-placeholder d-flex"
            >
              <div>
                You don't have any notifications!
              </div>
            </div>
          </v-list-item-group>
        </v-card>
        <a
          href="javascript: void(0)"
          @click="clearNotifications"
        >
          Clear all notifications
        </a>
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Notification } from "../types/appTypes";
import { mapState } from "vuex";
import moment from "moment";

Vue.use(Toast, {
  position: "top-center",
  timeout: 5000,
  closeOnClick: false,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__fade",
  maxToasts: 5,
  newestOnTop: true,
});

@Component({
  name: "NotificationsComponent",
  computed: mapState(["notifications"])
})
export default class NotificationsComponent extends Vue {
  private moment = moment;
  private notifications!: Notification[];
  private badgeColor = "blue";
  private notificationsCount = 0;

  @Watch("notifications")
  onNotificationsChanges(): void {
    this.showToast(this.notifications[0]);
    this.updateNotificationBadge();
  }

  private showToast(item: Notification): void {
    if(item) {
      switch (item.type) {
      case "info":
        this.$toast.info(item.message);
        break;
      case "warning":
        this.$toast.warning(item.message);
        break;
      case "error":
        this.$toast.error(item.message);
        break;
      }
    }
  }

  private toggleListItem(event: Event): void {
    if (event && event.target) {
      const target = event.target as HTMLElement;
      if (target.classList.contains("notifications-list-item-expanded"))
        target.classList.remove("notifications-list-item-expanded");
      else target.classList.add("notifications-list-item-expanded");
    }
  }

  private updateNotificationBadge(): void {
    const unreadItems = this.getUnreadItems();
    const unreadItemsCount = unreadItems.length;
    if (unreadItemsCount > 0) {
      this.notificationsCount = unreadItemsCount;
      let highestItemType = "info";
      if (
        unreadItems.find((item: Notification) => item.type === "error")
      ) {
        highestItemType = "error";
      } else if (
        unreadItems.find((item: Notification) => item.type === "warning")
      ) {
        highestItemType = "warning";
      }
      if (highestItemType === "info") this.badgeColor = "blue";
      else if (highestItemType === "warning") this.badgeColor = "orange";
      else if (highestItemType === "error") this.badgeColor = "red";
    } else this.notificationsCount = 0;

  }

  private getUnreadItems(): Array<Notification> {
    return this.notifications.filter(
      (item: Notification) => item.status === "new"
    );
  }

  private markAsRead(): void {
    this.$store.dispatch("markNotificationsAsRead");
    this.updateNotificationBadge();
  }

  private clearNotifications(): void {
    this.$store.dispatch("clearNotifications");
  }

  mounted(): void {
    this.updateNotificationBadge();
  }
}
</script>

<style lang="scss">
  .notifications-badge-and-bell-container {
    margin-top: 4px;
    margin-right: 20px;
  }

  .notifications-bell-icon {
    font-size: 26px !important;
    color: black !important;
  }

  .notifications-panel-card {
    width: 550px;
    height: 700px;
  }

  .notifications-panel-content {
    padding: 0 16px;
    height: 625px;
  }

  .notifications-panel-list {
    height: 530px;
    overflow: auto;
    margin-bottom: 10px;
  }

  .notifications-list-item {
    padding-left: 0 !important;
  }

  .notifications-list-item-expanded {
    white-space: normal !important;
  }

  .notifications-panel-tabs {
    height: 615px;
    overflow: hidden;
  }

  .notifications-no-notifications-placeholder {
    width: 100%;
    height: 525px;
    justify-content: center;
    align-items: center;
    font-size: 18px;
  }
</style>