<template>
  <v-card class="chart-wrapper">
    <v-card-title class="d-flex justify-space-between primary white--text">
      Forms status by type
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
    <div class="d-flex chart-card-content-pie">
      <div class="chart-pie-panel">
        <D3PieChart 
          v-if="ordersData" 
          :config="pieChartConfig1" 
          :datum="ordersData"
          :height="250"
        ></D3PieChart>
      </div>
      <div class="chart-pie-panel">
        <D3PieChart 
          v-if="reportsData" 
          :config="pieChartConfig2" 
          :datum="reportsData"
          :height="250"
        ></D3PieChart>
      </div>
      <div class="chart-pie-panel">
        <D3PieChart 
          v-if="requestsData" 
          :config="pieChartConfig3" 
          :datum="requestsData" 
          :height="250"
        ></D3PieChart>
      </div>
    </div>
    <div class="d-flex justify-space-between chart-bottom-panel">
      <div class="d-flex flex-column justify-center align-center chart-pie-legend">
        <span>Orders</span>
        <div class="d-flex">
          <span v-for="item in ordersData" :key="item.status" style="margin-right: 7px">
            {{ item.value + " " + item.status}}
          </span>
        </div>
      </div>
      <div class="d-flex flex-column justify-center align-center chart-pie-legend">
        <span>Reports</span>
        <div class="d-flex">
          <span v-for="item in reportsData" :key="item.status" style="margin-right: 7px">
            {{ item.value + " " + item.status}}
          </span>
        </div>
      </div>
      <div class="d-flex flex-column justify-center align-center chart-pie-legend">
        <span>Holiday requests</span>
        <div class="d-flex">
          <span v-for="item in requestsData" :key="item.status" style="margin-right: 7px">
            {{ item.value + " " + item.status}}
          </span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { D3BarChart, D3LineChart, D3PieChart } from "vue-d3-charts";
import moment from "moment-business-days";
import _ from "lodash";
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
  private orders = [];
  private reports = [];
  private holidayRequests = [];
  private ordersData = [];
  private reportsData = [];
  private requestsData = [];

  private dummyVar = "dummy";

  private pieChartConfig1 = {
    key: "status", 
    value: "value",
    color: {
      scheme: "schemeCategory10"
    },
    radius: { inner: 40, outter: false, padding: 0.05, round: 3 }
  }

  private pieChartConfig2 = {
    key: "status", 
    value: "value",
    color: {
      scheme: "schemeTableau10"
    },
    radius: { inner: 40, outter: false, padding: 0.05, round: 3 }
  }

  private pieChartConfig3 = {
    key: "status", 
    value: "value",
    color: {
      scheme: "schemeSet2"
    },
    radius: { inner: 40, outter: false, padding: 0.05, round: 3 }
  }

  private async fetchOrders() {
    this.orders = []; 
    this.orders = (await FormsService.getOrders()).data;

    setTimeout(() => {
    //eslint-disable-next-line
    this.ordersData = _(this.orders).groupBy("status")
      .map((objs: any, key: string) => ({//eslint-disable-line
          "status": key,
          "value": (_.countBy(objs, "status"))[key]
        }))
        .value();
    }, 1000);
  }

  private async fetchReports() {
    this.reports = [];
    this.reports = (await FormsService.getReports()).data;

    setTimeout(() => {
      this.reportsData = _(this.reports).groupBy("status")
      .map((objs: any, key: string) => ({//eslint-disable-line
          "status": key,
          "value": (_.countBy(objs, "status"))[key]
        }))
        .value();
    }, 1000);
  }

  private async fetchHolidayRequests() {
    this.holidayRequests = [];
    this.holidayRequests = (await FormsService.getHolidayRequests()).data;

    setTimeout(() => {
      this.requestsData = _(this.holidayRequests).groupBy("status")
      .map((objs: any, key: string) => ({//eslint-disable-line
          "status": key,
          "value": (_.countBy(objs, "status"))[key]
        }))
        .value(); 

    }, 1000);
  }

  private refershChart(): void {
    this.fetchOrders();
    this.fetchReports();
    this.fetchHolidayRequests();
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
  height: 67px;
}

.chart-card-content-pie {
  margin-top: -35px;
  width: 100%;
  height: calc(100% - 100px);
}

.chart-pie-legend {
  text-align: center;
  width: 33%;
}
</style>