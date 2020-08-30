<template>
  <div class="d-flex widgets-content">

    <v-card class="documents-card">
      <v-tabs
        v-model="tab"
        background-color="primary"
        centered
        dark
        icons-and-text
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab 
          v-for="item in items" 
          :key="item.id" 
          :href="'#tab-' + item.id"
        >
          {{ item.name }}
          <v-icon>{{ item.icon }}</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="item in items"
          :key="item.id"
          :value="'tab-' + item.id"
        >
          <v-card flat>
            <component v-if="item.comp" :is="item.comp" :key="item.i"></component>
            <!-- <v-card-text> {{ item.name + text }} </v-card-text> -->
          </v-card>
        </v-tab-item>
      </v-tabs-items>
  </v-card>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OrdersMgntComponent from "@/components/OrdersMgntComponent.vue";
import HolidayRequestsMgntComponent from "@/components/HolidayRequestsMgntComponent.vue";
import ReportsMgntComponent from "@/components/ReportsMgntComponent.vue";

@Component({
  name: "DocumentsComponent",
  components: {
    OrdersMgntComponent,
    HolidayRequestsMgntComponent,
    ReportsMgntComponent
  }
})
export default class DocumentsComponent extends Vue {
  private items = [
    { id: 0, name: "Orders", icon: "mdi-file", comp: OrdersMgntComponent },
    { id: 1, name: "Holiday requests", icon: "mdi-file", comp: HolidayRequestsMgntComponent },
    { id: 2, name: "Reports", icon: "mdi-file", comp:ReportsMgntComponent },
  ];
  // private items = [
  //   { id: 0, name: "Orders", icon: "mdi-file"},
  //   { id: 1, name: "Holiday requests", icon: "mdi-file" },
  //   { id: 2, name: "Reports", icon: "mdi-file"},
  // ];
  private tab = null;
  private text = "Lorem ipsum dolor sit amet, consectetur adipiscing";

}
</script>

<style lang="scss">
.documents-card {
  max-width: 85% !important;
  min-width: 85% !important;
  max-height: 825px;
  min-height: 825px;
  margin: auto;
  box-shadow: 
    0 5px 5px -3px rgba(0, 0, 0, 0.2), 
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 
    0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
}
</style>