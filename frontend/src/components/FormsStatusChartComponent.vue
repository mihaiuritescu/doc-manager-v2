<template>
  <v-card class="chart-wrapper">
    <v-card-title class="primary white--text">
      Total orders value by user
    </v-card-title>
    <div class="d-flex chart-card-content">
      <div class="chart-pie-panel">
        <D3PieChart 
          v-if="ordersData" 
          :config="pieChartConfig" 
          :datum="ordersData"
          :height="250"
        ></D3PieChart>
      </div>
      <div class="chart-pie-panel">
        <D3PieChart 
          v-if="reportsData" 
          :config="pieChartConfig" 
          :datum="reportsData"
          :height="250"
        ></D3PieChart>
      </div>
      <div class="chart-pie-panel">
        <D3PieChart 
          v-if="requestsData" 
          :config="pieChartConfig" 
          :datum="requestsData"
          :height="250"
        ></D3PieChart>
      </div>
    </div>
    <div class="d-flex justify-space-between chart-bottom-panel">
      <div class="chart-pie-legend">Orders</div>
      <div class="chart-pie-legend">Reports</div>
      <div class="chart-pie-legend">Holiday requests</div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { D3BarChart, D3LineChart, D3PieChart } from "vue-d3-charts";
import moment from "moment-business-days";
import VueLodash from "vue-lodash";
import _ from "lodash";
// import random from "lodash/random";
// import map from "lodash/map";
import {
  ComplexOrder,
  ComplexReport,
  ComplexHolidayRequest
} from "../types/appTypes";
import FormsService from "../services/FormsService";

@Component({
  name: "FormsStatusChartComponent",
  components: {
    D3BarChart,
    D3LineChart,
    D3PieChart
  }
})
export default class FormsStatusChartComponent extends Vue {
  private moment = moment;
  private orders = [] as ComplexOrder[];
  private reports = [] as ComplexReport[];
  private holidayRequests = [] as ComplexHolidayRequest[];
  private ordersData = [];
  private reportsData = [];
  private requestsData = [];
  private pieChartConfig = {
    key: "status",
    value: "value",
    color: {
      scheme: "schemeCategory10"
    },
    radius: { inner: 40, outter: false, padding: 0.05, round: 3 }
  }

  private async fetchOrders() {
    this.orders = [] as ComplexOrder[];
    this.orders = (await FormsService.getOrders()).data;

    setTimeout(() => {
      this.ordersData = _(this.orders).groupBy("status")
        .map((objs, key) => ({
          "status": key,
          "value": (_.countBy(objs, "status"))[key]
        }))
        .value();
    }, 1000);
  }

  private async fetchReports() {
    this.reports = [] as ComplexReport[];
    this.reports = (await FormsService.getReports()).data;

    setTimeout(() => {
      this.reportsData = _(this.reports).groupBy("status")
        .map((objs, key) => ({
          "status": key,
          "value": (_.countBy(objs, "status"))[key]
        }))
        .value();
    }, 1000);
  }

  private async fetchHolidayRequests() {
    this.holidayRequests = [] as ComplexHolidayRequest[];
    this.holidayRequests = (await FormsService.getHolidayRequests()).data;

    setTimeout(() => {
      this.requestsData = _(this.holidayRequests).groupBy("status")
        .map((objs, key) => ({
          "status": key,
          "value": (_.countBy(objs, "status"))[key]
        }))
        .value();
    }, 1000);
  }

  created(): void {
    this.fetchOrders();
    this.fetchReports();
    this.fetchHolidayRequests();
  }

}
</script>

<style lang="scss">
.chart-pie-panel {
  min-width: 33%;
  width: 33%;
}

.chart-bottom-panel {
  height: 36px;
}

.chart-card-content {
  width: 100%;
  height: calc(100% - 100px);
}

.chart-pie-legend {
  text-align: center;
  width: 33%;
}
</style>