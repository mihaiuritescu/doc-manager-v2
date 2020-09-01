<template>
  <div class="d-flex widgets-content">
    <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :col="{ lg: 8, md: 6, sm: 6, xs: 4, xxs: 2 }"
      :row-height="175"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[15, 15]"
      :use-css-transforms="true"
      class="widgets-grid"
    >
      <grid-item 
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :is-resizable="item.resizable"
        :key="item.i"
        class="d-flex align-center justify-center widgets-grid-widget"
      >
        <component 
          v-if="item.comp" 
          :is="item.comp" 
          :key="item.i" 
        ></component>
        <div v-else> {{item.i}} </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment-business-days";
import HolidayRequestComponent from "@/components/HolidayRequestComponent.vue";
import ReportComponent from "@/components/ReportComponent.vue";
import SupplierComponent from "@/components/SupplierComponent.vue";
import ProductComponent from "@/components/ProductComponent.vue";
import OrderComponent from "@/components/OrderComponent.vue";
import UsersOrdersChartComponent from "@/components/UsersOrdersChartComponent.vue";
import FormsStatusChartComponent from "@/components/FormsStatusChartComponent.vue";
import VueGridLayout from "vue-grid-layout";

@Component({
  name: "WidgetsComponent",
  components: {
    HolidayRequestComponent,
    ReportComponent,
    ProductComponent,
    OrderComponent,
    FormsStatusChartComponent,
    UsersOrdersChartComponent,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  }
})
export default class WidgetsComponent extends Vue {
  private moment = moment;

  private barChartConfig = {
    key: "userName",
    values: ["totalValue"],
    axis: {
      yTicks: 3
    },
    color: {
      default: "#222f3e",
      current: "#41B882"
    }
  }

  private chartType = "";

  private layout = [
    {"x":0,"y":0,"w":2,"h":1,"i":"0", resizable: false, comp: HolidayRequestComponent, compType: "tile" },
    {"x":2,"y":0,"w":2,"h":1,"i":"1", resizable: false, comp: ReportComponent, compType: "tile" },
    {"x":4,"y":0,"w":2,"h":1,"i":"2", resizable: false, comp: SupplierComponent, compType: "tile" },
    {"x":6,"y":0,"w":2,"h":1,"i":"3", resizable: false, comp: ProductComponent, compType: "tile" },
    {"x":8,"y":0,"w":2,"h":1,"i":"4", resizable: false, comp: OrderComponent, compType: "tile" },
    {"x":0,"y":2,"w":5,"h":2,"i":"5", resizable: true, comp: UsersOrdersChartComponent, compType: "chart" },
    {"x":5,"y":2,"w":7,"h":2,"i":"6", resizable: true, comp: FormsStatusChartComponent, compType: "chart" }
  ];
}
</script>

<style lang="scss">
.widgets-content {
  background-color: #eee;
  height: calc(100% - 64px); 
  // height: 100%; 
  width: 100%;
  max-height: 872px;
  overflow: auto;
  padding: 10px;
}

.widgets-grid {
  height: 100%;
  width: 100%;
}

.widgets-grid-widget {
  // padding: 10px;
  background-color: white;
  border: solid 1px lightgrey;
  box-shadow: 
    0 5px 5px -3px rgba(0,0,0,.2), 
    0 8px 10px 1px rgba(0,0,0,.14), 
    0 3px 14px 2px rgba(0,0,0,.12);
  border-radius: 4px;
}
</style>