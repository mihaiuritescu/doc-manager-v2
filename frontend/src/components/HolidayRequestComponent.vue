<template>
  <div class="d-flex flex-column align-center justify-space-between holiday-request-wrapper">
    <v-icon>mdi-account</v-icon>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          New Holiday Request
        </v-btn>
      </template>

      <!-- Dialog content -->
      <v-card>
        <v-card-title class="headline primary white--text">
          Holiday Request
        </v-card-title>

        <v-card-text>
          <v-form>
            <div class="d-flex justify-space-between">
              <v-text-field
                class="register-field"
                color="accent"
                label="First name"
                name="firstname"
                prepend-icon="mdi-account"
                type="text"
                v-model="user.firstname"
                readonly
              ></v-text-field>
              <v-text-field
                class="register-field"
                color="accent"
                label="Last name"
                name="lastname"
                prepend-icon="mdi-account"
                type="text"
                v-model="user.lastname"
                readonly
              ></v-text-field>
            </div>
            <div class="d-flex justify-space-between">
              <v-text-field
                class="register-field"
                color="accent"
                v-model="user.occupation"
                label="Occupation"
                name="occupation"
                prepend-icon="mdi-account"
                type="text"
                readonly
              ></v-text-field>
              <v-text-field
                class="register-field"
                color="accent"
                v-model="user.department"
                label="Department"
                name="department"
                prepend-icon="mdi-account"
                type="text"
                readonly
              ></v-text-field>
            </div>
            <div class="d-flex justify-space-between">
              <v-menu
                ref="startDateMenu"
                v-model="startDateMenu"
                :close-on-content-click="false"
                :return-value.sync="holidayRequest.startDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="register-field"
                    v-model="holidayRequest.startDate"
                    label="Start date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="holidayRequest.startDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="startDateMenu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.startDateMenu.save(holidayRequest.startDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <v-menu
                ref="endDateMenu"
                v-model="endDateMenu"
                :close-on-content-click="false"
                :return-value.sync="holidayRequest.endDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="register-field"
                    v-model="holidayRequest.endDate"
                    label="End date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="holidayRequest.endDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="endDateMenu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.endDateMenu.save(holidayRequest.endDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </div>
            <div class="d-flex justify-space-between">
              <v-text-field
                class="register-field"
                color="accent"
                label="Holiday length"
                name="holidayLength"
                prepend-icon="mdi-account"
                type="text"
                readonly
              ></v-text-field>
              <v-text-field
                class="register-field"
                color="accent"
                v-model="holidayRequest.contact"
                label="Contact"
                name="contact"
                prepend-icon="mdi-account"
                type="text"
                :rules="[((() => !!holidayRequest.contact) || 'This field is required')]"
              ></v-text-field>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="submitRequest"
          >
            Submit new holiday request
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User, HolidayRequest } from "..//types/appTypes";
import { mapState } from "vuex";

@Component({
  name: "HolidayRequestComponent",
  computed: mapState(["user"])
})
export default class HolidayRequestComponent extends Vue {
  private dialog = false;
  private startDateMenu = false;
  private endDateMenu = false;
  // private startDate = new Date().toISOString().substr(0, 10);
  // private endDate = new Date().toISOString().substr(0, 10);
  private user!: User;
  private holidayRequest = {} as HolidayRequest;

  private submitRequest(): void {
    if(this.checkForm()) {
      console.log(this.holidayRequest);
      console.log(Date.parse(this.holidayRequest.startDate));
      // CALCULATE DATE DIFFERENCE
      this.dialog = false;
    }
  }

  private checkForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [key, value] of Object.entries(this.holidayRequest)) {
      if(!value) return false;
    }
    return true;
  }

  mounted(): void {
    this.holidayRequest = {
      userEmail: this.user.email,
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      contact: "",
      status: "new"
    };
  }
}
</script>>

<style lang="scss">
.holiday-request-wrapper {
  height: 100%;
  width: 100%;
}
</style>>