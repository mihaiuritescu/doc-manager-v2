<template>
  <div class="d-flex flex-column align-center justify-space-between report-wrapper">
    <v-icon class="app-widget-icon">mdi-file-document-edit</v-icon>
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
          New Report
        </v-btn>
      </template>

      <!-- Dialog content -->
      <v-card>
        <v-card-title class="headline secondary white--text">
          Report
        </v-card-title>

        <v-card-text class="report-card-content">
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
              <v-text-field
                v-model="report.address"
                class="register-field"
                color="accent"
                label="Location address"
                name="address"
                prepend-icon="mdi-map-marker"
                type="text"
                :rules="[((() => !!report.address) || 'This field is required')]"
              ></v-text-field>
              <v-text-field
                class="register-field"
                color="accent"
                v-model="report.phone"
                label="Phone"
                name="phone"
                prepend-icon="mdi-phone"
                type="text"
                :rules="[((() => !!report.phone) || 'This field is required')]"
              ></v-text-field>
            </div>
            <div class="d-flex justify-space-between">
              <v-text-field
                v-model="report.locationManager"
                class="register-field"
                color="accent"
                label="Location manager"
                name="locationManager"
                prepend-icon="mdi-account"
                type="text"
                :rules="[((() => !!report.locationManager) || 'This field is required')]"
              ></v-text-field>
              <v-text-field
                class="register-field"
                color="accent"
                v-model="report.equipmentType"
                label="Equipment type"
                name="equipmentType"
                prepend-icon="mdi-laptop"
                type="text"
                :rules="[((() => !!report.equipmentType) || 'This field is required')]"
              ></v-text-field>
            </div>
            <v-textarea
              outlined
              v-model="report.equipmentDetails"
              auto-grow
              row-height="2"
              name="equipmentDetails"
              label="Equipment details"
            ></v-textarea>
            <v-textarea
              outlined
              v-model="report.problemsFound"
              auto-grow
              row-height="2"
              name="problemsFound"
              label="Problems found"
              :rules="[((() => !!report.problemsFound) || 'This field is required')]"
            ></v-textarea>
            <v-textarea
              outlined
              v-model="report.observations"
              auto-grow
              row-height="2"
              name="observations"
              label="Observations"
            ></v-textarea>
          </v-form>
          <span v-if="error" class="report-error">{{ error }}</span>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="d-flex justify-space-between report-actions">
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
            Submit report
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { User, Report } from "..//types/appTypes";
import { mapState } from "vuex";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "ReportComponent",
  computed: mapState(["user"])
})
export default class ReportComponent extends Vue {
  private moment = moment;
  private dialog = false;
  private user!: User;
  private report = {} as Report;
  private error = "";

  @Watch("report", { immediate: true, deep: true })
  onReportChange(): void {
    this.error = "";
  }

  private async submitRequest() {
    if(this.checkForm()) {
      try {
        const response = await FormsService.submitReport(this.report);
        if(response && response.data) {
          this.clearForm();
          this.$store.commit("addNotification", 
            { message: "The report was successfully registered", 
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
    } else this.error = "Please fill all required fields";
  }

  private clearForm(): void {
    this.dialog = false;
    this.error = "";
    this.report = {} as Report;
    this.report.userEmail = this.user.email;
  }

  private checkForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [key, value] of Object.entries(this.report)) {
      if(key != "equipmentDetails" && key != "observations" && !value) return false;
    }
    return true;
  }

  mounted(): void {
    this.report = {
      userEmail: this.user.email,
      address: "",
      phone: "",
      locationManager: "",
      equipmentType: "",
      equipmentDetails: "",
      problemsFound: "",
      observations: "",
      status: "new"
    };
  }
}
</script>>

<style lang="scss">
.report-wrapper {
  height: 100%;
  width: 100%;
}

.report-error {
  color: red;
}

.report-card-content {
  margin-top: 15px !important;
  margin-bottom: -10px !important;
}

.report-actions {
  padding: 10px 25px !important;
}
</style>>