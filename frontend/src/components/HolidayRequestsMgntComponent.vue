<template>
  <div class="d-flex flex-column holidayRequests-mgnt-wrapper">
    <div class="d-flex align-center holidayRequests-mgnt-filters">
      <div class="d-flex justify-space-between holidayRequests-mgnt-filters-content">
        <v-text-field 
          class="holidayRequests-mgnt-filters-item"
          v-model="searchValue"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          persistentHint
          :hint="hintMessage"
          clearable
          @click:clear="searchValue = ''"
        ></v-text-field>
        <v-select 
          class="holidayRequests-mgnt-filters-item"
          v-model="occupation"
          color="accent"
          label="Position"
          :items="occupations"
        ></v-select>
        <v-select 
          class="holidayRequests-mgnt-filters-item"
          v-model="department"
          color="accent"
          label="Department"
          :items="departments"
        ></v-select>
        <v-select 
          class="holidayRequests-mgnt-filters-item"
          v-model="status"
          color="accent"
          label="Status"
          :items="statuses"
        ></v-select>
        <v-menu
          ref="startDateMenu"
          v-model="startDateMenu"
          :close-on-content-click="false"
          :return-value.sync="startDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="holidayRequests-mgnt-filters-item"
              v-model="startDate"
              label="Start date"
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="startDateMenu = false">Cancel</v-btn>
            <v-btn text color="secondary" @click="$refs.startDateMenu.save(startDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="endDateMenu"
          v-model="endDateMenu"
          :close-on-content-click="false"
          :return-value.sync="endDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              class="holidayRequests-mgnt-filters-item"
              v-model="endDate"
              label="End date"
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="endDateMenu = false">Cancel</v-btn>
            <v-btn text color="secondary" @click="$refs.endDateMenu.save(endDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </div>
      <v-divider vertical></v-divider>
      <div class="d-flex flex-column justify-center align-center holidayRequests-mgnt-actions">
        <v-btn 
          class="secondary"
          :disabled="disabledSave"
          @click="saveChanges"
        >
          Save changes
        </v-btn>
      </div>
    </div>

    <div class="d-flex holidayRequests-mgnt-list-header">
      <span class="holidayRequests-mgnt-list-item-cell holidayRequests-mgnt-list-header-field">Name</span>
      <span class="holidayRequests-mgnt-list-item-cell holidayRequests-mgnt-list-header-field">Position</span>
      <span class="holidayRequests-mgnt-list-item-cell holidayRequests-mgnt-list-header-field">Department</span>
      <span class="holidayRequests-mgnt-list-item-cell-medium holidayRequests-mgnt-list-header-field">Interval</span>
      
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span    
            v-bind="attrs"
            v-on="on" 
            class="
              holidayRequests-mgnt-list-item-cell-xsmall 
              holidayRequests-mgnt-list-header-field
              "
            >
              Length
          </span>
        </template>
        <span>Holiday length (in working days)</span>
      </v-tooltip>
      <span class="holidayRequests-mgnt-list-item-cell-small holidayRequests-mgnt-list-header-field">Status</span>
      <span class="holidayRequests-mgnt-list-item-cell holidayRequests-mgnt-list-header-field">Generated</span>
    </div>
    <div class="d-flex flex-column holidayRequests-mgnt-list">
      <v-skeleton-loader
        v-if="holidayRequests.length == 0"
        type="table-tbody"
        class="mx-auto"
      ></v-skeleton-loader>
      <div 
        class="d-flex justify-space-between holidayRequests-mgnt-list-item"
        v-for="item in filteredHolidayRequests"
        :key="item.id"
      >
        <v-text-field 
          class="holidayRequests-mgnt-list-item-cell"
          v-model="item.userName"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="holidayRequests-mgnt-list-item-cell"
          v-model="item.userOcc"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="holidayRequests-mgnt-list-item-cell"
          v-model="item.userDept"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="holidayRequests-mgnt-list-item-cell-medium"
          :value="moment(item.startDate).format('DD.MM') + ' - ' + moment(item.endDate).format('DD.MM.YYYY')"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="holidayRequests-mgnt-list-item-cell-xsmall"
          :value="moment(item.startDate, 'YYYY-MM-DD').businessDiff(moment(item.endDate, 'YYYY-MM-DD'))"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="holidayRequests-mgnt-list-item-cell-small"
          v-model="item.status"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="holidayRequests-mgnt-list-item-cell"
          v-model="item.createdAt"
          outlined
          readonly
          :value="moment(item.createdAt).format('YYYY-MM-DD')"
        > fdhgdfhdfh </v-text-field>
        <div v-if="item.status === 'new'" class="d-flex justify-space-between align-center holidayRequests-mgnt-list-item-btns">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="holidayRequests-mgnt-delete-button"
                v-bind="attrs"
                v-on="on"
                color="success"
                @click="item.status = 'approved'; item.edited = true; disabledSave = false"
              >
                Approve
              </v-btn>
            </template>
            <span>Approve this order</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="holidayRequests-mgnt-delete-button"
                v-bind="attrs"
                v-on="on"
                color="error"
                @click="item.status = 'rejected'; item.edited = true; disabledSave = false"
              >
                Reject
              </v-btn>
            </template>
            <span>Reject this order</span>
          </v-tooltip>
        </div>
        <div v-else class="d-flex justify-space-between align-center holidayRequests-mgnt-list-item-btns"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ComplexHolidayRequest } from "..//types/appTypes";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "HolidayRequestsMgntComponent"
})
export default class HolidayRequestsMgntComponent extends Vue {
  private moment = moment;
  private holidayRequests = [] as ComplexHolidayRequest[];
  private searchValue = "";
  private hintMessage = "Search for holidayRequests";
  private disabledSave = true;
  private departments = ["All"] as string[];
  private occupations = ["All"] as string[];
  private statuses = ["All", "New", "Approved", "Rejected"] as string[];
  private department = "";
  private occupation = "";
  private status = "";
  private startDate = "";
  private endDate = "";
  private startDateMenu = false;
  private endDateMenu = false;

  get filteredHolidayRequests(): ComplexHolidayRequest[] {
    const search = this.searchValue ? this.searchValue.toLowerCase() : "";
    const occupation = this.occupation || "";
    const department = this.department || "";
    const status = this.status || "";
    const startDate = this.startDate || "";
    const endDate = this.endDate || "";

    let result = this.holidayRequests;

    if (search) {
      result = result.filter(item => {
        const text = item.userName.toLowerCase();
        return text.indexOf(search) > -1 ;
      });
    }

    if (occupation && occupation !== "All") {
      result = result.filter(item =>  item.userOcc === occupation );
    }

    if (department && department !== "All") {
      result = result.filter(item => {
        return item.userDept === department;
      });
    }

    if (status && status !== "All") {
      result = result.filter(item => {
        return item.status === status.toLowerCase();
      });
    }

    if (startDate && endDate) {
      result = result.filter(item => {
        return moment(item.createdAt) >= moment(startDate) && moment(item.createdAt) <= moment(endDate);
      });
    }

    if (result && result.length ) return result;
    else return this.holidayRequests;
  }

  private async saveChanges() {
    this.disabledSave = true;
    const updatedHolidayRequests = this.holidayRequests.filter(item => item.edited === true );
    
    try {
      var response = null;
      if(updatedHolidayRequests && updatedHolidayRequests.length)
        response = await FormsService.updateHolidayRequests(updatedHolidayRequests);

      if(response) this.fetchHolidayRequests();

      this.$store.commit("addNotification", 
        { message: "HolidayRequests succesfully updated", 
          type: "info", 
          date: Date.now(), 
          status: "new"
        });

    } catch (error) {
      this.disabledSave = false;
      this.$store.commit("addNotification", 
        { message: error.message ? error.message : error, 
          type: "error", 
          date: Date.now(), 
          status: "new"
        });
    }

  }

  private async fetchHolidayRequests() {
    this.holidayRequests = [] as ComplexHolidayRequest[];
    this.holidayRequests = (await FormsService.getHolidayRequests()).data;
  }

  private async fetchDeptAndOcc() {
    const departments = (await FormsService.getDepartments()).data;
    departments.forEach( (department: any) => {//eslint-disable-line
      this.departments.push(department.name);
    });

    const occupations = (await FormsService.getOccupations()).data;
    occupations.forEach( (occupation: any) => {//eslint-disable-line
      this.occupations.push(occupation.name);
    });
  }

  private mounted(): void {
    this.fetchHolidayRequests();
    this.fetchDeptAndOcc();
  }
}

</script>

<style lang="scss">
.holidayRequests-mgnt-wrapper {
  padding: 0 20px 20px 20px;
}

.holidayRequests-mgnt-list {
  min-height: 590px;
  max-height: 590px;
  overflow: auto;
  padding-right: 15px;
}

.holidayRequests-mgnt-list-item, .holidayRequests-mgnt-list-header {
  width: 100%;
}

.holidayRequests-mgnt-actions {
  width: 15%;
}

.holidayRequests-mgnt-filters {
  padding: 15px 0;
}

.holidayRequests-mgnt-filters-content {
  width: 85%;
}

.holidayRequests-mgnt-filters-item {
  margin-right: 25px;
  max-width: 150px !important;
}

.holidayRequests-mgnt-list-header {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #000000a2;
}

.holidayRequests-mgnt-list-header {
  width: 82% !important;
}

.holidayRequests-mgnt-list-item {
  height: 70px;
}

.holidayRequests-mgnt-list-header-field:not(:last-child) {
  margin-right: 24px;
  font-weight: bold;
}

.holidayRequests-mgnt-list-item-cell {
  width: 180px !important;
  max-width: 180px !important;
}

.holidayRequests-mgnt-list-item-cell-small {
  width: 100px !important;
  max-width: 100px !important;
}

.holidayRequests-mgnt-list-item-cell-xsmall {
  width: 50px !important;
  max-width: 50px !important;
  overflow: hidden;
  word-wrap: none;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.holidayRequests-mgnt-list-item-cell-medium {
  width: 160px !important;
  max-width: 160px !important;
}

.holidayRequests-mgnt-list-item-btns {
  width: 210px;
  height: 100%;
  padding-bottom: 15px;
}

.holidayRequests-mgnt-list .v-skeleton-loader__table-cell{
  align-items: center;
  display: flex;
  height: 85px;
  width: 165px;
  margin-right: 70px;
}
</style>