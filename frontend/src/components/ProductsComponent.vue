<template>
  <div class="d-flex-colummn widgets-content products-content">
    <v-card 
      class="products-filter-card"
      raised
    >
      <v-card-title class="headline secondary white--text">Filters</v-card-title>
      <div class="d-flex justify-space-between align-center products-filters">
        <v-text-field 
          class="products-filters-search"
          v-model="searchValue"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          persistentHint
          :hint="hintMessage"
          clearable
          @click:clear="searchValue = ''"
        ></v-text-field>
        <v-select 
          class="products-filters-supplier"
          color="accent"
          label="Supplier"
          :items="suppliers"
        ></v-select>
        <v-text-field 
          class="products-filters-min-price"
          v-model="priceLimits.low"
          label="Min Price"
          prepend-inner-icon="mdi-currency-eur"
        ></v-text-field>
        <v-text-field 
          class="products-filters-max-price"
          v-model="priceLimits.high"
          label="Max Price"
          prepend-inner-icon="mdi-currency-eur"
        ></v-text-field>
        <v-divider vertical></v-divider>
        <div class="d-flex flex-column justify-center align-center products-actions">
          <v-btn class="secondary">Save</v-btn>
        </div>
      </div>
    </v-card>
    <v-card 
      class="products-list-card"
      raised
    >
      <div class="d-flex products-list-header">
        <span class="products-list-item-name products-list-header-field">Name</span>
        <span class="products-list-item-description products-list-header-field">Description</span>
        <span class="products-list-item-price products-list-header-field">Price (€)</span>
        <span class="products-list-item-supplier products-list-header-field">Supplier</span>
      </div>
      <div class="d-flex flex-column products-list">
        <v-skeleton-loader
          v-if="products.length == 0"
          type="table-tbody"
          class="mx-auto"
        ></v-skeleton-loader>
        <div 
          class="d-flex justify-space-between products-list-item"
          v-for="item in products"
          :key="item.id"
        >
          <v-text-field 
            class="products-list-item-name"
            v-model="item.name"
            outlined
          ></v-text-field>
          <v-text-field 
            class="products-list-item-description"
            v-model="item.description"
            outlined
          ></v-text-field>
          <v-text-field 
            class="products-list-item-price"
            v-model="item.price"
            outlined
          ></v-text-field>
          <v-text-field 
            class="products-list-item-supplier"
            v-model="item.supplier"
            outlined
            disabled
          ></v-text-field>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ComplexProduct, Supplier } from "..//types/appTypes";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "ProductsComponent"
})
export default class ProductsComponent extends Vue {
  private moment = moment;
  private suppliers = [];
  private products = [] as ComplexProduct[];
  private searchValue = "";
  private hintMessage = "Search for products";
  private priceLimits = { low: 1, high: 999999 };

  private async fetchSupliers() {
    const suppliers = (await FormsService.getSuppliers()).data;
    suppliers.forEach( (supplier: Supplier) => {
      this.suppliers.push(supplier.name);
    });
  }

  private async fetchProducts() {
    this.products = (await FormsService.getProducts()).data;
  }

  private mounted(): void {
    this.fetchProducts();
    this.fetchSupliers();
  }
}
</script>

<style lang="scss">
// .products-content {
//   max-height: 825px;
// }

.products-filters-search {
  max-width: 250px !important;
}

.products-filters-supplier {
  max-width: 250px !important;
}

.products-filter-card, .products-list-card {
  padding: 20px;
  max-width: 70% !important;
  margin: auto;
  box-shadow: 
    0 5px 5px -3px rgba(0, 0, 0, 0.2), 
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 
    0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
}

.products-filter-card {
  margin-bottom: 20px;
  padding: 0px !important;
}

.products-list-card {
  max-height: 595px;
}

.products-actions {
  width: 100px;
}

.products-list {
  max-height: 510px;
  overflow: auto;
  padding-right: 15px;
}

.products-list-item, .products-list-header, .products-filters {
  width: 100%;
}

.products-filters {
  padding: 15px;
}

.products-filters-min-price, .products-filters-max-price {
  max-width: 100px !important;
}

.products-list-header, .products-filters-text {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #000000a2;
}

.products-list-item {
  height: 70px;
}

// .products-list-item:nth-child(odd)  {
//   background-color: rgba(115, 211, 112, 0.199);
// }

// .products-list-item:nth-child(even)  {
//   background-color: rgba(112, 122, 211, 0.199);
// }

.products-list-header-field:not(:last-child) {
  margin-right: 16px;
  font-weight: bold;
}

.products-list-item-name {
  width: 300px !important;
  max-width: 300px !important;
}

.products-list-item-description {
  width: 425px !important;
  max-width: 425px !important;

}

.products-list-item-price {
  width: 80px !important;
  max-width: 80px !important;

}

.products-list-item-supplier {
  width: 250px !important;
  max-width: 250px !important;

}

.products-list .v-skeleton-loader__table-cell{
  align-items: center;
  display: flex;
  height: 85px;
  width: 165px;
  margin-right: 70px;
}
</style>