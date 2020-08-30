<template>
  <div class="d-flex flex-column align-center justify-space-between holiday-request-wrapper">
    <v-icon class="app-widget-icon">mdi-palm-tree</v-icon>
    <v-dialog
      v-model="dialog"
      width="500"
      @click:outside="clearForm"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="secondary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          New Holiday Request
        </v-btn>
      </template>

      <!-- Dialog content -->
      <v-card>
        <v-card-title class="headline secondary white--text">
          Holiday Request
        </v-card-title>

        <v-card-text class="holiday-request-card-content">
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
                disabled
              ></v-text-field>
              <v-text-field
                class="register-field"
                color="accent"
                label="Last name"
                name="lastname"
                prepend-icon="mdi-account"
                type="text"
                v-model="user.lastname"
                disabled
              ></v-text-field>
            </div>
            <div class="d-flex justify-space-between">
              <v-text-field
                class="register-field"
                color="accent"
                v-model="user.occupation"
                label="Occupation"
                name="occupation"
                prepend-icon="mdi-briefcase"
                type="text"
                disabled
              ></v-text-field>
              <v-text-field
                class="register-field"
                color="accent"
                v-model="user.department"
                label="Department"
                name="department"
                prepend-icon="mdi-account-group"
                type="text"
                disabled
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
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="holidayRequest.startDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="secondary" @click="startDateMenu = false">Cancel</v-btn>
                  <v-btn text color="secondary" @click="$refs.startDateMenu.save(holidayRequest.startDate)">OK</v-btn>
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
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="holidayRequest.endDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="secondary" @click="endDateMenu = false">Cancel</v-btn>
                  <v-btn text color="secondary" @click="$refs.endDateMenu.save(holidayRequest.endDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </div>
            <div class="d-flex justify-space-between">
              <v-text-field
                v-model="holidayLenght"
                class="register-field"
                color="accent"
                label="Holiday length"
                name="holidayLength"
                prepend-icon="mdi-calendar-range"
                type="text"
                disabled
              ></v-text-field>
              <v-text-field
                class="register-field"
                color="accent"
                v-model="holidayRequest.contact"
                label="Contact"
                name="contact"
                prepend-icon="mdi-phone"
                type="text"
                :rules="[((() => !!holidayRequest.contact) || 'This field is required')]"
              ></v-text-field>
            </div>
          </v-form>
          <span v-if="error" class="holiday-request-error">{{ error }}</span>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="d-flex justify-space-between holiday-request-actions">
          <v-btn
            color="secondary"
            outlined
            @click="clearForm"
          >
            Cancel
          </v-btn>
          <v-btn
            color="secondary"
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { User, HolidayRequest } from "..//types/appTypes";
import { mapState } from "vuex";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "HolidayRequestComponent",
  computed: mapState(["user"])
})
export default class HolidayRequestComponent extends Vue {
  private moment = moment;
  private dialog = false;
  private startDateMenu = false;
  private endDateMenu = false;
  private holidayLenght = 0;
  private user!: User;
  private holidayRequest = {} as HolidayRequest;
  private error = "";

  @Watch("holidayRequest", { immediate: true, deep: true })
  onHolidayRequestChange(): void {
    this.error = "";
    if(this.holidayRequest.startDate && this.holidayRequest.endDate)
      this.holidayLenght = moment(this.holidayRequest.startDate, "YYYY-MM-DD").businessDiff(moment(this.holidayRequest.endDate, "YYYY-MM-DD"));
  }

  private async submitRequest() {
    if(this.checkForm() && this.holidayLenght > 0) {
      try {
        const response = await FormsService.submitHolidayRequest(this.holidayRequest);
        if(response && response.data) {
          this.clearForm();
          this.$store.commit("addNotification", 
            { message: "The holiday request was successfully registered", 
              type: "info", 
              date: Date.now(), 
              status: "new"
            });
        }
      } catch (error) {
        this.error = error.response.data.error;
        this.$store.commit("addNotification", 
          { message: error, 
            type: "error", 
            date: Date.now(), 
            status: "new"
          });
      }
    } else this.error = "All fields are required and holiday length should be > 0";
  }

  private clearForm(): void {
    this.dialog = false;
    this.error = "";
    this.holidayRequest.contact = "";
    this.holidayRequest.startDate = new Date().toISOString().substr(0, 10);
    this.holidayRequest.endDate = new Date().toISOString().substr(0, 10);
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

.holiday-request-error {
  color: red;
}

.holiday-request-card-content {
  margin-top: 15px !important;
  margin-bottom: -10px !important;
}

.holiday-request-actions {
  padding: 10px 25px !important;
}
</style>>