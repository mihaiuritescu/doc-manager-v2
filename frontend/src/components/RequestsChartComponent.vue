<template>
  <v-card class="chart-wrapper">
    <v-card-title class="d-flex justify-space-between primary white--text">
      Number of holiday requests by month
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
      <div class="chart-left-panel-requests">
        <D3BarChart 
          v-if="requestsData" 
          :config="barChartConfig" 
          :datum="requestsData"
          :height="250"
        ></D3BarChart>
      </div>
      <div class="d-flex flex-column justify-center align-center chart-right-panel-requests">
        <span v-for="item in requestsData" :key="item.createdAt">{{ item.createdAt + ": " + item.totalValue }}</span>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { D3BarChart } from "vue-d3-charts";
import moment from "moment-business-days";
import _ from "lodash";
import FormsService from "../services/FormsService";

@Component({
  name: "RequestsChartComponent",
  components: {
    D3BarChart
  }
})
export default class RequestsChartComponent extends Vue {
  private moment = moment;
  private holidayRequests = [];
  private requestsData = [];

  private dummyVar = "dummy";

  private barChartConfig = { 
    key: "createdAt",
    values: ["totalValue"],
    axis: {
      yTicks: 6,
      yFormat: ".0f"
    },
    labelRotation: 45,
    transition: { ease: "easeBounceOut" },
    color: {
      default: "#f28e2c",
      current: "#f28e2c"
    }
  }

  private async fetchHolidayRequests() {
    this.holidayRequests = []; 
    this.holidayRequests = (await FormsService.getHolidayRequests()).data;

    this.holidayRequests.forEach( (item: any) => {//eslint-disable-line
      item.createdAt = moment(item.createdAt).format("MMM");
    } );

    setTimeout(() => {
      this.requestsData = _(this.holidayRequests) 
        .groupBy("createdAt")
        .map((objs: any, key: string) => ({//eslint-disable-line
          "createdAt": key,
          "totalValue": (_.countBy(objs, "totalValue"))["undefined"]
        })).value();
    }, 1000);

  }

  private refershChart(): void {
    this.fetchHolidayRequests();
  }  

  created(): void {
    this.fetchHolidayRequests();
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

.chart-card-content {
  width: 100%; 
  height: calc(100% - 64px);
}

.chart-left-panel-requests {
  width: 85%;
  max-width: 85%;
}

.chart-right-panel-requests {
  width: 15%;
  max-width: 15%;
}

.chart-filters-item {
  width: 100%;
  max-width: 100%;
  height: 50px;
  max-height: 50px;
}

</style>