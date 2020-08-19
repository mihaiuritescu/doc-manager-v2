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
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>        
          <v-card-text>            
            <v-form>
              <v-text-field
                label="Email"
                name="email"
                prepend-icon="mdi-account"
                type="text"
                v-model="email"
                :rules="[() => !!email || 'This field is required', checkEmail]"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="[() => !!password && password.length >= 8 || 'Address must be at least 8 characters long']"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="registerUser" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AuthService from "../services/AuthService";

@Component
export default class RegisterComponent extends Vue {
  private email: string = "";
  private password: string = "";
  private formHasErrors = false;

  private async registerUser() {
    console.log(this.email, this.password);
    const response = await AuthService.register({
      email: this.email,
      password: this.password
    });
    console.log(response.data);
  }

  private checkEmail() {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(this.email) || 'Invalid e-mail.';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
