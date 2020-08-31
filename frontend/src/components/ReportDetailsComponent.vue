<template>
  <v-card outlined>
    <v-card-title class="headline secondary white--text">
      Report
    </v-card-title>

    <v-card-text class="report-details-card-content">
      <v-form>
        <div class="d-flex justify-space-between">
          <v-text-field
            class="report-details-field"
            color="accent"
            label="User name"
            name="username"
            prepend-icon="mdi-account"
            type="text"
            :value="report.userName"
            readonly
          ></v-text-field>
          <v-text-field
            class="report-details-field"
            color="accent"
            label="User email"
            name="email"
            prepend-icon="mdi-account"
            type="text"
            :value="report.email"
            readonly
          ></v-text-field>
        </div>
        <div class="d-flex justify-space-between">
          <v-text-field
            class="report-details-field"
            color="accent"
            :value="report.userOcc"
            label="Occupation"
            name="occupation"
            prepend-icon="mdi-briefcase"
            type="text"
            readonly
          ></v-text-field>
          <v-text-field
            class="report-details-field"
            color="accent"
            :value="report.userDept"
            label="Department"
            name="department"
            prepend-icon="mdi-account-group"
            type="text"
            readonly
          ></v-text-field>
        </div>
        <v-divider class="report-details-divider"></v-divider>
        <div class="d-flex justify-space-between">
          <v-text-field
            :value="report.address"
            class="report-details-field"
            color="accent"
            label="Location address"
            name="address"
            prepend-icon="mdi-map-marker"
            type="text"
            readonly
          ></v-text-field>
          <v-text-field
            class="report-details-field"
            color="accent"
            :value="report.phone"
            label="Location phone"
            name="phone"
            prepend-icon="mdi-phone"
            type="text"
            readonly
          ></v-text-field>
        </div>
        <div class="d-flex justify-space-between">
          <v-text-field
            :value="report.locationManager"
            class="report-details-field"
            color="accent"
            label="Location manager"
            name="locationManager"
            prepend-icon="mdi-account"
            type="text"
            readonly
          ></v-text-field>
          <v-text-field
            class="report-details-field"
            color="accent"
            :value="report.equipmentType"
            label="Equipment type"
            name="equipmentType"
            prepend-icon="mdi-laptop"
            type="text"
            readonly
          ></v-text-field>
        </div>
        <v-textarea
          outlined
          :value="report.equipmentDetails"
          auto-grow
          row-height="2"
          name="equipmentDetails"
          label="Equipment details"
          readonly
        ></v-textarea>
        <v-textarea
          outlined
          :value="report.problemsFound"
          auto-grow
          row-height="2"
          name="problemsFound"
          label="Problems found"
          readonly
        ></v-textarea>
        <v-textarea
          outlined
          :value="report.observations"
          auto-grow
          row-height="2"
          name="observations"
          label="Observations"
          readonly
        ></v-textarea>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ComplexReport } from "../types/appTypes";
import moment from "moment-business-days";

@Component({
  name: "ReportDetailsComponent"
})
export default class ReportDetailsComponent extends Vue {
  @Prop({ default: {} }) private report?: ComplexReport;
  private moment = moment;
}
</script>>

<style lang="scss">
.report-details-wrapper {
  height: 100%;
  width: 100%;
}

.report-details-error {
  color: red;
}

.report-details-card-content {
  margin-top: 15px !important;
  margin-bottom: -10px !important;
}

.report-details-field {
  max-width: 270px !important;
}

.report-details-divider {
  margin-bottom: 15px;
}

.report-details-actions {
  padding: 10px 25px !important;
}
</style>