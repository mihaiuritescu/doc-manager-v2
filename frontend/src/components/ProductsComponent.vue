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
          v-model="supplier"
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
          v-for="item in filteredProducts"
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
            class="products-list-item-name"
            v-model="item.name"
            outlined
            @keypress="item.edited = true; disabledSave = false"
          ></v-text-field>
          <v-text-field 
            class="products-list-item-description"
            v-model="item.description"
            outlined
            @keypress="item.edited = true; disabledSave = false"
          ></v-text-field>
          <v-text-field 
            class="products-list-item-price"
            v-model="item.price"
            outlined
            @keypress="item.edited = true; disabledSave = false"
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
  private suppliers = ["All"] as string[];
  private products = [] as ComplexProduct[];
  private searchValue = "";
  private supplier = "";
  private hintMessage = "Search for products";
  private priceLimits = { low: 1, high: 999999 };
  private disabledSave = true;

  get filteredProducts(): ComplexProduct[] {
    const search = this.searchValue ? this.searchValue.toLowerCase() : "";
    const minPrice = Number(this.priceLimits.low) || 1;
    const maxPrice = Number(this.priceLimits.high) || 99999;
    const supplier = this.supplier || "";

    let result = null;
    if(search && supplier && supplier !== "All") {
      result = this.products.filter(item => {
        const text = item.name.toLowerCase();
        return ( text.indexOf(search) > -1 
          && item.price <= maxPrice 
          && item.price >= minPrice 
          && item.supplier === supplier
        );
      });
    } else if (search && !supplier || supplier === "All") {
      result = this.products.filter(item => {
        const text = item.name.toLowerCase();
        return ( text.indexOf(search) > -1 
          && item.price <= maxPrice 
          && item.price >= minPrice
        );
      });
    } else if (!search && supplier) {
      result = this.products.filter(item => {
        return item.supplier === supplier
          && item.price <= maxPrice 
          && item.price >= minPrice;
      });
    } else {
      result = this.products.filter(item => {
        return item.price <= maxPrice && item.price >= minPrice;
      });
    }

    if (result && result.length ) return result;
    else return this.products;
  }

  private async saveChanges() {
    this.disabledSave = true;
    const updatedProducts = this.products.filter(item => (item.edited === true && !item.deleted));
    const deletedProducts = this.products.filter(item => item.deleted === true);
    
    try {
      var response1, response2 = null;
      if(deletedProducts && deletedProducts.length)
        response1 = await FormsService.updateProducts({ action: "delete", array: deletedProducts });
      if(updatedProducts && updatedProducts.length)
        response2 = await FormsService.updateProducts({ action: "update", array: updatedProducts });

      if(response1 || response2) this.fetchProducts();

      this.$store.commit("addNotification", 
        { message: "Products succesfully updated", 
          type: "info", 
          date: Date.now(), 
          status: "new"
        });

    } catch (error) {
      this.disabledSave = false;
      this.$store.commit("addNotification", 
        { message: error.message ? error.message : error, 
          type: "error", 
          date: Date.now(), 
          status: "new"
        });
    }

  }

  private async fetchSupliers() {
    const suppliers = (await FormsService.getSuppliers()).data;
    suppliers.forEach( (supplier: Supplier) => {
      this.suppliers.push(supplier.name);
    });
  }

  private async fetchProducts() {
    this.products = [] as ComplexProduct[];
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
  max-width: 75% !important;
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
  max-height: 645px;
}

.products-list {
  max-height: 563px;
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

.products-list-header {
  margin-left: 60px
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
  margin-right: 24px;
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