<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
        class="login-col"
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="accent"
            flat
          >
            <v-toolbar-title class="white--text">Login</v-toolbar-title>
          </v-toolbar>        
          <v-card-text>
            <h2 class="d-flex justify-center">Welcome to DocManager!</h2>
            <h3 class="login-description">
              Don't have a DocManager account? 
              <a href="/register">Sign Up</a>
            </h3>     
            <v-form>
              <v-text-field
                color="accent"
                label="Email"
                name="email"
                prepend-icon="mdi-account"
                type="text"
                v-model="credentials.email"
                :rules="[((() => !!credentials.email) || 'This field is required'), checkEmail]"
              ></v-text-field>
              <v-text-field
                color="accent"
                v-model="credentials.password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[() => !!credentials.password && credentials.password.length >= 8 || 'Address must be at least 8 characters long']"
              ></v-text-field>
            </v-form>
            <span v-if="error" class="register-error">
              {{error}}
            </span>
          </v-card-text>
          <v-card-actions class="justify-center align-center d-flex">
            <v-btn 
              @click="loginUser" 
              color="accent"
              class="login-button"
            >
              Sign in to your account
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AuthService from "../services/AuthService";
import { Credentials } from "../types/appTypes";

@Component({
  name: "LoginComponent"
})
export default class LoginComponent extends Vue {
  private credentials = {} as Credentials;
  private error = "";

  @Watch("credentials")
  private onCredentialsChange() {
    this.error = "";
  }

  private async loginUser() {
    if(this.checkForm() && this.checkEmail() === true) {
      try {
        const response = await AuthService.login(this.credentials);
        this.$store.dispatch("setToken", response.data.token);
        delete response.data.user.id;
        delete response.data.user.createdAt;
        delete response.data.user.updatedAt;
        this.$store.dispatch("setUser", response.data.user);
        this.error = "";
        this.$router.push("dashboard");
      } catch (error) {
        this.error = error.response.data.error;
      }
    } else this.error = "Please fill all the above fields!";
  }

  private checkEmail() {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(this.credentials.email) || "Invalid e-mail.";
  }

  private checkForm() {
    if(this.credentials.email && this.credentials.password && this.credentials.password.length >= 8) return true;
    else return false;
  }

}
</script>

<style lang="scss">
.login-col {
  max-width: 450px !important;
}

.login-description {
  margin-top: 15px;
  margin-left: 33px;
  margin-bottom: 15px;
}

.login-button {
  margin-bottom: 15px;
}
</style>
