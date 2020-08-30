<template>
  <div class="d-flex flex-column orders-mgnt-wrapper">
    <div class="d-flex align-center orders-mgnt-filters">
      <div class="d-flex orders-mgnt-filters-content">
        <v-text-field 
          class="orders-mgnt-filters-item"
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
          label="Position"
          :items="occupations"
        ></v-select>
        <v-select 
          class="employees-filters-item"
          v-model="department"
          color="accent"
          label="Department"
          :items="departments"
        ></v-select>
        <v-select 
          class="employees-filters-item"
          v-model="status"
          color="accent"
          label="Status"
          :items="statuses"
        ></v-select>        
      </div>
      <v-divider vertical></v-divider>
      <div class="d-flex flex-column justify-center align-center orders-mgnt-actions">
        <v-btn 
          class="secondary"
          :disabled="disabledSave"
          @click="saveChanges"
        >
          Save changes
        </v-btn>
      </div>
    </div>

    <div class="d-flex orders-mgnt-list-header">
      <span class="orders-mgnt-list-item-cell orders-mgnt-list-header-field">Name</span>
      <span class="orders-mgnt-list-item-cell orders-mgnt-list-header-field">Position</span>
      <span class="orders-mgnt-list-item-cell orders-mgnt-list-header-field">Department</span>
      <span class="orders-mgnt-list-item-cell-small orders-mgnt-list-header-field">Order value</span>
      <span class="orders-mgnt-list-item-cell-small orders-mgnt-list-header-field">Status</span>
      <span class="orders-mgnt-list-item-cell orders-mgnt-list-header-field">Generated</span>
    </div>
    <div class="d-flex flex-column orders-mgnt-list">
      <v-skeleton-loader
        v-if="orders.length == 0"
        type="table-tbody"
        class="mx-auto"
      ></v-skeleton-loader>
      <div 
        class="d-flex justify-space-between orders-mgnt-list-item"
        v-for="item in orders"
        :key="item.id"
      >
        <v-text-field 
          class="orders-mgnt-list-item-cell"
          v-model="item.userName"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="orders-mgnt-list-item-cell"
          v-model="item.userOcc"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="orders-mgnt-list-item-cell"
          v-model="item.userDept"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="orders-mgnt-list-item-cell-small"
          v-model="item.totalValue"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="orders-mgnt-list-item-cell-small"
          v-model="item.status"
          outlined
          readonly
        ></v-text-field>
        <v-text-field 
          class="orders-mgnt-list-item-cell"
          v-model="item.createdAt"
          outlined
          readonly
        ></v-text-field>
        <div v-if="item.status === 'new'" class="d-flex justify-space-between align-center orders-mgnt-list-item-btns">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="orders-mgnt-delete-button"
                v-bind="attrs"
                v-on="on"
                color="success"
                @click="item.status = 'approved'; disabledSave = false"
              >
                Approve
              </v-btn>
            </template>
            <span>Approve this order</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="orders-mgnt-delete-button"
                v-bind="attrs"
                v-on="on"
                color="error"
                @click="item.status = 'rejected'; disabledSave = false"
              >
                Reject
              </v-btn>
            </template>
            <span>Reject this order</span>
          </v-tooltip>
        </div>
        <div v-else class="d-flex justify-space-between align-center orders-mgnt-list-item-btns"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ComplexOrder } from "..//types/appTypes";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "OrdersMgntComponent"
})
export default class OrdersMgntComponent extends Vue {
  private moment = moment;
  private orders = [] as ComplexOrder[];
  private searchValue = "";
  private hintMessage = "Search for orders";
  private disabledSave = true;
  private departments = ["All"] as string[];
  private occupations = ["All"] as string[];
  private statuses = ["New", "Accepted", "Rejected"] as string[];
  private department = "";
  private occupation = "";
  private status = "";

  private async saveChanges() {
    //
  }

  private async fetchOrders() {
    this.orders = [] as ComplexOrder[];
    this.orders = (await FormsService.getOrders()).data;
  }

  private mounted(): void {
    this.fetchOrders();
  }
}
</script>

<style lang="scss">
.orders-mgnt-wrapper {
  padding: 0 20px 20px 20px;
}

.orders-mgnt-filters-search {
  max-width: 250px !important;
}

.orders-mgnt-filters-supplier {
  max-width: 250px !important;
}

.orders-mgnt-filter-card, .orders-mgnt-list-card {
  padding: 20px;
  max-width: 75% !important;
  margin: auto;
  box-shadow: 
    0 5px 5px -3px rgba(0, 0, 0, 0.2), 
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 
    0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
}

.orders-mgnt-filter-card {
  margin-bottom: 20px;
  padding: 0px !important;
}

.orders-mgnt-list-card {
  max-height: 645px;
}

.orders-mgnt-list {
  max-height: 563px;
  overflow: auto;
  padding-right: 15px;
}

.orders-mgnt-list-item, .orders-mgnt-list-header, .orders-mgnt-filters {
  width: 100%;
}

.orders-mgnt-filters {
  padding: 15px 0;
}

.orders-mgnt-actions {
  width: 15%;
}

.orders-mgnt-filters-content {
  width: 85%;
}

.orders-mgnt-filters-min-price, .orders-mgnt-filters-max-price {
  max-width: 100px !important;
}

.orders-mgnt-list-header, .orders-mgnt-filters-text {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #000000a2;
}

.orders-mgnt-list-header {
  width: 81% !important;
}

.orders-mgnt-list-item {
  height: 70px;
}

.orders-mgnt-list-header-field:not(:last-child) {
  margin-right: 24px;
  font-weight: bold;
}

.orders-mgnt-list-item-name {
  width: 250px !important;
  max-width: 250px !important;
}

.orders-mgnt-list-item-cell {
  width: 200px !important;
  max-width: 200px !important;
}

.orders-mgnt-list-item-cell-small {
  width: 100px !important;
  max-width: 100px !important;
}

.orders-mgnt-list-item-btns {
  width: 210px;
  height: 100%;
  padding-bottom: 15px;
}

.orders-mgnt-list .v-skeleton-loader__table-cell{
  align-items: center;
  display: flex;
  height: 85px;
  width: 165px;
  margin-right: 70px;
}
</style>