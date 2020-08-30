<template>
  <div>
    <v-menu
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
      transition="slide-x-reverse-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-avatar color="blue" v-bind="attrs" v-on="on">
          <v-skeleton-loader
            v-if="!user"
            type="avatar"
          ></v-skeleton-loader>
          <img v-else-if="user.profilePicture" :src="user.profilePicture" alt="John" />
          <span v-else class="white--text headline">{{ getUserInitials }}</span>
        </v-avatar>
      </template>

      <!-- Skeleton loader is shown until user data is available -->
      <v-card
        v-if="!user"
        class="user-profile-card d-flex flex-column"
      >
        <v-container class="user-profile-card-container">
          <div class="d-flex justify-space-between align-center user-profile-user-details">
            <v-skeleton-loader type="avatar"></v-skeleton-loader>
            <v-col class="d-flex-column align-flex-start user-profile-contact-details">
              <v-skeleton-loader type="card-heading"></v-skeleton-loader>
              <v-skeleton-loader
                class="user-profile-skeleton-text-long"
                type="text"
              ></v-skeleton-loader>
              <v-skeleton-loader
                class="user-profile-skeleton-text-long"
                type="text"
              ></v-skeleton-loader>
              <v-skeleton-loader
                class="user-profile-skeleton-text-long"
                type="text"
              ></v-skeleton-loader>
            </v-col>
          </div>
          <v-divider></v-divider>
          <div class="buttons d-flex">
            <v-skeleton-loader
              tile
              class="user-profile-skeleton-text-short-2"
              type="text"
            ></v-skeleton-loader>
            <v-divider vertical></v-divider>
            <v-skeleton-loader
              tile
              class="user-profile-skeleton-text-short-2"
              type="text"
            ></v-skeleton-loader>
          </div>
        </v-container>
      </v-card>

      <!-- The actual card containing user details -->
      <v-card v-else class="user-profile-card d-flex flex-column">
        <v-container class="user-profile-card-container">
          <div class="d-flex justify-space-between align-center user-profile-user-details">
            <v-avatar size="70" color="green">
              <img v-if="user.profilePicture" :src="user.profilePicture" alt="John" />
              <span v-else class="white--text headline">{{ getUserInitials }}</span>
            </v-avatar>
            <v-col class="d-flex-column align-flex-start user-profile-contact-details">
              <p v-if="user.firstname && user.lastname" class="user-profile-fullname">
                {{ getUserFullName }}
              </p>
              <p v-if="user.email">
                <span>E-mail: </span>
                {{ user.email }}
              </p>
              <p v-if="user.occupation">
                <span>Position: </span>
                {{ user.occupation }}
              </p>
              <p v-if="user.department">
                <span>Department: </span>
                {{ user.department }}
              </p>
              <span v-if="user.admin" class="user-profile-admin-title">
                Admin</span
              >
            </v-col>
          </div>
          <v-divider></v-divider>
          <div class="buttons d-flex">
            <v-btn
              @click="openSettingsDialog"
              depressed
              tile
              class="user-profile-profile-button"
              >Settings</v-btn
            >
            <v-divider vertical></v-divider>
            <v-btn
              depressed
              tile
              class="user-profile-profile-button"
              @click="logout"
              >Logout</v-btn
            >
          </div>
        </v-container>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "..//types/appTypes";
import { mapState } from "vuex";

@Component({
  name: "UserProfileComponent",
  computed: mapState(["user"])
})
export default class UserProfileComponent extends Vue {
  private user!: User;

  get getUserInitials(): string {
    return this.user.firstname[0] + this.user.lastname[0]; 
  }

  get getUserFullName(): string {
    return this.user.firstname + " " + this.user.lastname; 
  }

  private openSettingsDialog(): void {
    this.$emit("open-settings-dialog");
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
  .user-profile-card {
    width: 350px;
    padding-top: 16px;
  }

  .user-profile-card-container {
    padding: 0 !important;
  }

  .user-profile-user-details {
    padding: 0 20px !important;
  }

  .user-profile-user-details p {
    margin-bottom: 0 !important;
  }

  .user-profile-contact-details,
  .user-profile-plan-details {
    color: black;
    font-size: 12px;
    line-height: 16px;
  }

  .user-profile-contact-details span {
    font-weight: bold;
  }

  .user-profile-plan-details {
    padding: 16px 0;
  }

  .user-profile-fullname {
    font-size: 18px;
    line-height: 24px;
    font-weight: bold;
  }

  .user-profile-company-name {
    margin-top: 10px;
  }

  .user-profile-admin-title {
    display: inline-block;
    margin: 10px auto 0px;
    padding: 3px 8px 2px;
    border-radius: 3px;
    background-color: #3e64e4;
    font-size: 9px;
    font-weight: bold;
    color: #ffffff;
    text-transform: uppercase;
  }

  .user-profile-plan-name {
    text-transform: capitalize;
    font-weight: bold;
  }

  .user-profile-components-used {
    color: #3e64e4;
    font-weight: bold;
  }

  .user-profile-profile-button {
    height: 42px !important;
    width: 50% !important;
    color: black !important;
    background-color: white !important;
    text-transform: capitalize !important;
    font-size: 12px !important;
    font-weight: bold !important;
    padding-left: 21px !important;
  }

  .user-profile-profile-button:hover {
    height: 42px !important;
    color: white !important;
    background-color: #4caf50 !important;
  }

  .user-profile-card .v-skeleton-loader__avatar {
    width: 70px;
    height: 70px;
  }

  .user-profile-card .v-skeleton-loader__heading {
    width: 65%;
  }

  .user-profile-skeleton-text-short {
    width: 60px;
  }

  .user-profile-skeleton-text-short-2 {
    margin: 10px 15px 5px;
    width: 50%;
  }

  .user-profile-skeleton-text-long {
    width: 200px;
  }

  .user-profile-skeleton-button {
    width: 45px;
    height: 20px;
  }
</style>