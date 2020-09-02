<template>
  <v-card class="chart-wrapper">
    <v-card-title class="d-flex justify-space-between primary white--text">
      Number of reports by month
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
      <div class="chart-left-panel-reports">
        <D3PieChart 
          v-if="reportsData" 
          :config="pieChartConfig" 
          :datum="reportsData"
          :height="250"
        ></D3PieChart>
      </div>
      <div class="d-flex flex-column justify-center align-flex-start chart-right-panel-reports">
        <span v-for="item in reportsData" :key="item.createdAt">{{ item.createdAt + ": " + item.value }}</span>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { D3PieChart } from "vue-d3-charts";
import moment from "moment-business-days";
import _ from "lodash";
import FormsService from "../services/FormsService";

@Component({
  name: "ReportsChartComponent",
  components: {
    D3PieChart
  }
})
export default class ReportsChartComponent extends Vue {
  private moment = moment;
  private reports = [];
  private reportsData = [];

  private dummyVar = "dummy";

  private pieChartConfig = {
    key: "createdAt",
    value: "value", 
    color: {
      scheme: "schemeSet1"
    },
    radius: { inner: 60, outter: false, padding: 0.05, round: 3 }
  }

  private async fetchReports() {
    this.reports = [];
    this.reports = (await FormsService.getReports()).data;

    this.reports.forEach( (item: any) => {//eslint-disable-line
      item.createdAt = moment(item.createdAt).format("MMM");
    } );

    setTimeout(() => {
      this.reportsData = _(this.reports)
        .groupBy("createdAt")
        .map((objs: any, key: string) => ({//eslint-disable-line
          "createdAt": key,
          "value": (_.countBy(objs, "value"))["undefined"]
        })).value();
    }, 1000);

  }

  private refershChart(): void {
    this.fetchReports(); 
  }  

  created(): void {
    this.fetchReports();
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

.chart-left-panel-reports {
  width: 85%;
  max-width: 85%;
}

.chart-right-panel-reports {
  width: 15%;
  max-width: 15%;
  margin-left: -10px;
}

.chart-filters-item {
  width: 100%;
  max-width: 100%;
  height: 50px;
  max-height: 50px;
}

</style>