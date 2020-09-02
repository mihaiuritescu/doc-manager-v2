<template>
  <v-card class="chart-wrapper">
    <v-card-title class="d-flex justify-space-between primary white--text">
      {{ cardTitle }}
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn            
            v-bind="attrs"
            v-on="on" 
            icon 
            @click="refershChart"
          >
            <v-icon class="white--text">mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh data</span>
      </v-tooltip>
    </v-card-title>
    <div class="d-flex chart-card-content">
      <div class="chart-left-panel-bars">
        <D3BarChart 
          v-if="usersOrdersData" 
          :config="barChartConfig" 
          :datum="usersOrdersData"
          :height="250"
        ></D3BarChart>
      </div>
      <div class="d-flex flex-column chart-right-panel-bars">
        <v-select 
          class="chart-filters-item"
          prepend-icon="mdi-file"
          v-model="formType"
          color="accent"
          label="FormType"
          :items="formTypes"
        ></v-select>
        <v-select 
          class="chart-filters-item"
          prepend-icon="mdi-briefcase"
          v-model="occupation"
          color="accent"
          label="Position"
          :items="occupations"
        ></v-select>
        <v-select 
          class="chart-filters-item"
          prepend-icon="mdi-account-group"
          v-model="department"
          color="accent"
          label="Department"
          :items="departments"
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
              class="chart-filters-item"
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
              class="chart-filters-item"
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
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { D3BarChart } from "vue-d3-charts";
import moment from "moment-business-days";
import _ from "lodash";
import FormsService from "../services/FormsService";

@Component({
  name: "ChartComponent",
  components: {
    D3BarChart
  }
})
export default class ChartComponent extends Vue {
  private moment = moment;
  private orders = [];
  private reports = [];
  private holidayRequests = [];
  private chartData = [];
  private departments = ["All"] as string[];
  private occupations = ["All"] as string[];
  private formTypes = ["Orders", "Reports", "Holiday requests"] as string[];
  private occupation = "";
  private department = "";
  private formType = "Orders";
  private usersOrdersData = [];
  private startDate = "";
  private endDate = "";
  private cardTitle = "Total orders value by user";
  private startDateMenu = false;
  private endDateMenu = false;

  private dummyVar = "dummy";

  private barChartConfig = { 
    key: "userName",
    values: ["totalValue"],
    axis: {
      yTicks: 6,
      yFormat: ".0f" 
    },
    labelRotation: 45,
    transition: { ease: "easeBounceOut" },
    color: {
      default: "#1f77b4",
      current: "#1f77b4"
    }
  }

  @Watch("department")
  onDeptChange(): void {
    this.filteredReports(this.chartData);
  }

  @Watch("occupation")
  onOccChange(): void {
    this.filteredReports(this.chartData);
  }

  @Watch("startDate")
  onStartDateChange(): void {
    this.filteredReports(this.chartData);
  }

  @Watch("endDate")
  onEndDateChange(): void {
    this.filteredReports(this.chartData);
  }

  @Watch("formType")
  onFormTypeChange(newValue: string): void {
    switch (newValue) {
    case "Orders":
      this.chartData = [];
      this.chartData = [...this.orders];
      this.cardTitle = "Total orders value by user";
      this.filteredReports(this.chartData);
      break;
    case "Reports":
      this.chartData = [];
      this.cardTitle = "Number of reports per user";
      this.chartData = [...this.reports];
      this.filteredReports(this.chartData);
      break;
    case "Holiday requests":
      this.chartData = [];
      this.cardTitle = "Number of holiday requests per user";
      this.chartData = [...this.holidayRequests];
      this.filteredReports(this.chartData);
      break;
    default:
      break;
    }
  }

  private filteredReports(array: any) {//eslint-disable-line
    const occupation = this.occupation || "";
    const department = this.department || "";
    const startDate = this.startDate || "";
    const endDate = this.endDate || "";

    let result = array;

    if (occupation && occupation !== "All") {
      result = result.filter((item: any) =>  item.userOcc === occupation );//eslint-disable-line
    }

    if (department && department !== "All") {
      result = result.filter((item: any) => {//eslint-disable-line 
        return item.userDept === department;
      });
    }

    if (status && status !== "All") {
      result = result.filter((item: any) => {//eslint-disable-line
        return item.status === status.toLowerCase();
      });
    }

    if (startDate && endDate) {
      result = result.filter((item: any) => {//eslint-disable-line
        return moment(item.createdAt) >= moment(startDate) && moment(item.createdAt) <= moment(endDate);
      });
    }

    if (result && result.length ) this.filteredData(result);
  }

  private filteredData(array: any) {//eslint-disable-line
    switch (this.formType) {
    case "Orders":
      this.usersOrdersData = [];
      this.usersOrdersData = _(array).groupBy("userName")
        .map((objs: any, key: string) => ({//eslint-disable-line
          "userName": key,
          "totalValue": _.sumBy(objs, "totalValue") 
        }))
        .value();
      this.usersOrdersData.forEach( (item: any) => {//eslint-disable-line
        item.userName = item.userName.substr(0, item.userName.indexOf(" "));
      });
      break;
    case "Reports":
      this.usersOrdersData = [];
      this.usersOrdersData = _(array)
        .groupBy("userName")
        .map((objs: any, key: string) => ({//eslint-disable-line
          "userName": key,
          "totalValue": (_.countBy(objs, "totalValue"))["undefined"]
        })).value();
      this.usersOrdersData.forEach( (item: any) => {//eslint-disable-line
        item.userName = item.userName.substr(0, item.userName.indexOf(" "));
      });
      break;
    case "Holiday requests":
      this.usersOrdersData = [];
      this.usersOrdersData = _(array)
        .groupBy("userName")
        .map((objs: any, key: string) => ({//eslint-disable-line
          "userName": key,
          "totalValue": (_.countBy(objs, "totalValue"))["undefined"]
        })).value();
      this.usersOrdersData.forEach( (item: any) => {//eslint-disable-line
        item.userName = item.userName.substr(0, item.userName.indexOf(" "));
      });
      break;
    default: 
      break;
    }
  } 

  private async fetchOrders() {
    this.orders = [];
    this.orders = (await FormsService.getOrders()).data;

    setTimeout(() => {
      this.chartData = [...this.orders];
      this.filteredData(this.chartData);
    }, 1000); 
  }

  private async fetchReports() {
    this.reports = [];
    this.reports = (await FormsService.getReports()).data;
  }

  private async fetchHolidayRequests() {
    this.holidayRequests = []; 
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

  private refershChart(): void {
    this.fetchOrders();
    this.fetchReports(); 
    this.fetchHolidayRequests();
    // this.formType = "";
    // this.formType = "Reports";
  }  

  created(): void {
    this.fetchOrders();
    this.fetchReports();
    this.fetchHolidayRequests();
    this.fetchDeptAndOcc();
  }

}
</script>

<style lang="scss">
.chart-wrapper {
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
}

.chart-wrapper .chart {
  width: 100%;
  max-width: 100%;
}

.chart-wrapper .chart__tooltip {
  display: none !important;
}

.chart-wrapper .chart__grid {
  margin-left: 5px !important;
}

.chart-wrapper text {
  margin-bottom: 5px !important;
}

// .chart-wrapper .chart__margin-wrap {
//   height: 100% !important;
// }

.chart-card-content {
  width: 100%; 
  height: calc(100% - 64px);
}

.chart-left-panel-bars {
  min-width: 75%;
  width: 75%;
}

.chart-right-panel-bars {
  padding: 10px;
  min-width: 25%;
  width: 25%;
}

.chart-filters-item {
  width: 100%;
  max-width: 100%;
  height: 50px;
  max-height: 50px;
}

</style>