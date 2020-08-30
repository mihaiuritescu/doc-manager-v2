<template>
  <div class="d-flex-colummn widgets-content employees-content">
    <v-card 
      class="employees-filter-card"
      raised
    >
      <v-card-title class="headline secondary white--text">Filters</v-card-title>
      <div class="d-flex align-center employees-filters">
        <div class="d-flex employees-filters-content">
          <v-text-field 
            class="employees-filters-item"
            v-model="searchValue"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            persistentHint
            :hint="hintMessage"
            clearable
            @click:clear="searchValue = ''"
          ></v-text-field>
          <v-select 
            class="employees-filters-item"
            v-model="occupation"
            color="accent"
            label="Occupation"
            :items="occupations"
          ></v-select>
          <v-select 
            class="employees-filters-item"
            v-model="department"
            color="accent"
            label="Department"
            :items="departments"
          ></v-select>
        </div>
        <v-divider vertical></v-divider>
        <div class="d-flex flex-column justify-center align-center employees-actions">
          <v-btn 
            class="secondary"
            :disabled="disabledSave"
            @click="saveChanges"
          >
            Save changes
          </v-btn>
        </div>
      </div>
    </v-card>
    <v-card 
      class="employees-list-card"
      raised
    >
      <div class="d-flex employees-list-header">
        <span class="employees-list-item-cell employees-list-header-field">Firstname</span>
        <span class="employees-list-item-cell employees-list-header-field">Lastname</span>
        <span class="employees-list-item-cell-large employees-list-header-field">Email</span>
        <span class="employees-list-item-cell employees-list-header-field">Phone</span>
        <span class="employees-list-item-cell-xlarge employees-list-header-field">Address</span>
        <span class="employees-list-item-cell employees-list-header-field">Postal Code</span>
        <span class="employees-list-item-cell employees-list-header-field">City</span>
      </div>
      <div class="d-flex flex-column employees-list">
        <v-skeleton-loader
          v-if="employees.length == 0"
          type="table-tbody"
          class="mx-auto"
        ></v-skeleton-loader>
        <div 
          class="d-flex justify-space-between employees-list-item"
          v-for="item in filteredEmployees"
          :key="item.id"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="employees-delete-button"
                v-bind="attrs"
                v-on="on"
                icon
                @click="item.deleted ? item.deleted = false : item.deleted = true; disabledSave = false"
                :color="item.deleted ? 'error' : 'grey'"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </template>
            <span>Mark user for delete</span>
          </v-tooltip>
          <v-text-field 
            class="employees-list-item-cell"
            v-model="item.firstname"
            outlined
            @keypress="item.edited = true; disabledSave = false"
            :disabled="item.deleted ? true : false"
          ></v-text-field>
          <v-text-field 
            class="employees-list-item-cell"
            v-model="item.lastname"
            outlined
            @keypress="item.edited = true; disabledSave = false"
            :disabled="item.deleted ? true : false"
          ></v-text-field>
          <v-text-field 
            class="employees-list-item-cell employees-list-item-cell-large"
            v-model="item.email"
            outlined
            disabled
          ></v-text-field>
          <v-text-field 
            class="employees-list-item-cell"
            v-model="item.phone"
            outlined
            @keypress="item.edited = true; disabledSave = false"
            :disabled="item.deleted ? true : false"
          ></v-text-field>
          <v-text-field 
            class="employees-list-item-cell  employees-list-item-cell-xlarge"
            v-model="item.address"
            outlined
            @keypress="item.edited = true; disabledSave = false"
            :disabled="item.deleted ? true : false"
          ></v-text-field>
          <v-text-field 
            class="employees-list-item-cell"
            v-model="item.postalcode"
            outlined
            @keypress="item.edited = true; disabledSave = false"
            :disabled="item.deleted ? true : false"
          ></v-text-field>
          <v-text-field 
            class="employees-list-item-cell"
            v-model="item.city"
            outlined
            @keypress="item.edited = true; disabledSave = false"
            :disabled="item.deleted ? true : false"
          ></v-text-field>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Employee } from "..//types/appTypes";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "EmployeesComponent"
})
export default class EmployeesComponent extends Vue {
  private moment = moment;
  private departments = ["All"] as string[];
  private occupations = ["All"] as string[];
  private employees = [] as Employee[];
  private searchValue = "";
  private department = "";
  private occupation = "";
  private hintMessage = "Search for employees by name";
  private disabledSave = true;

  get filteredEmployees(): Employee[] {
    const search = this.searchValue ? this.searchValue.toLowerCase() : "";
    const occupation = this.occupation || "";
    const department = this.department || "";

    let result = this.employees;

    if (search) {
      result = result.filter(item => {
        const text = item.firstname.toLowerCase();
        const text1 = item.lastname.toLowerCase();
        return ( text.indexOf(search) > -1 || text1.indexOf(search) > -1);
      });
    }

    if (occupation && occupation !== "All") {
      result = result.filter(item =>  item.occupationName === occupation );
    }

    if (department && department !== "All") {
      result = result.filter(item => {
        return item.departmentName === department;
      });
    }

    if (result && result.length ) return result;
    else return this.employees;
  }

  

  private async saveChanges() {
    this.disabledSave = true;
    const updatedEmployees = this.employees.filter(item => (item.edited === true && !item.deleted));
    const deletedEmployees = this.employees.filter(item => item.deleted === true);
    
    try {
      var response1, response2 = null;
      if(deletedEmployees && deletedEmployees.length)
        response1 = await FormsService.updateEmployees({ action: "delete", array: deletedEmployees });
      if(updatedEmployees && updatedEmployees.length)
        response2 = await FormsService.updateEmployees({ action: "update", array: updatedEmployees });

      if(response1 || response2) this.fetchEmployees();

      this.$store.commit("addNotification", 
        { message: "Employees succesfully updated", 
          type: "info", 
          date: Date.now(), 
          status: "new"
        });

    } catch (error) {
      this.disabledSave = false;
      this.$store.commit("addNotification", 
        { message: error, 
          type: "error", 
          date: Date.now(), 
          status: "new"
        });
    }

  }

  private async fetchEmployees() {
    // this.employees = [] as ComplexProduct[];
    this.employees = [];
    this.employees = (await FormsService.getEmployees()).data;
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
    this.fetchEmployees();
    this.fetchDeptAndOcc();
  }
}
</script>

<style lang="scss">
// .employees-content {
//   max-height: 825px;
// }

.employees-filters-search {
  max-width: 250px !important;
}

.employees-filters-supplier {
  max-width: 250px !important;
}

.employees-filter-card, .employees-list-card {
  padding: 20px;
  max-width: 90% !important;
  margin: auto;
  box-shadow: 
    0 5px 5px -3px rgba(0, 0, 0, 0.2), 
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 
    0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
}

.employees-delete-button {
  margin-top: 10px;
}

.employees-filter-card {
  margin-bottom: 20px;
  padding: 0px !important;
}

.employees-list-card {
  max-height: 645px;
}

.employees-actions {
  width: 15%;
}

.employees-list {
  max-height: 563px;
  overflow: auto;
  padding-right: 15px;
}

.employees-list-item, .employees-list-header, .employees-filters {
  width: 100%;
}

.employees-filters {
  padding: 15px;
}

.employees-filters-content {
  padding: 0 15px;
  width: 85%;
}

.employees-filters-item:first-child {
  max-width: 300px !important;
}

.employees-filters-item {
  margin-right: 25px;
  max-width: 200px !important;
}

.employees-list-header, .employees-filters-text {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #000000a2;
}

.employees-list-header {
  margin-left: 45px;
}

.employees-list-item {
  height: 70px;
}

.employees-list-header-field:not(:last-child) {
  margin-right: 12px;
  font-weight: bold;
}

.employees-list-item-cell {
  width: 135px !important;
  max-width: 135px !important;
}

.employees-list-item-cell-large {
  width: 300px !important;
  max-width: 300px !important;
}

.employees-list-item-cell-xlarge {
  width: 350px !important;
  max-width: 350px !important;
}

.employees-list .v-skeleton-loader__table-cell{
  align-items: center;
  display: flex;
  height: 85px;
  width: 165px;
  margin-right: 70px;
}
</style>