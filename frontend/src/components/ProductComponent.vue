<template>
  <div class="d-flex flex-column align-center justify-space-between product-wrapper">
    <v-icon class="app-widget-icon">mdi-monitor</v-icon>
    <v-dialog
      v-model="dialog"
      width="500"
      @click:outside="clearForm"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          @click="fetchSupliers"
        >
          New product
        </v-btn>
      </template>

      <!-- Dialog content -->
      <v-card>
        <v-card-title class="headline primary white--text">
          Product
        </v-card-title>

        <v-card-text class="product-card-content">
          <v-form>
            <div class="d-flex-column">
              <v-textarea
                class="product-field"
                color="accent"
                label="Name"
                name="productName"
                prepend-icon="mdi-account"
                type="text"
                auto-grow
                row-height="2"
                clearable
                clear-icon="mdi-keyboard-variant"
                outlined
                v-model="product.name"
                :rules="[((() => !!product.name) || 'This field is required')]"
              ></v-textarea>
              <v-textarea
                class="product-field"
                color="accent"
                label="Description"
                name="description"
                prepend-icon="mdi-at"
                type="text"
                clearable
                clear-icon="format-align-justify"
                auto-grow
                row-height="2"
                outlined
                v-model="product.description"
                :rules="[((() => !!product.description) || 'This field is required')]"
              ></v-textarea>
              <v-textarea
                v-model="product.price"
                class="product-field"
                color="accent"
                label="Price"
                name="price"
                prepend-icon="mdi-currency-eur"
                type="text"
                auto-grow
                clearable
                clear-icon="mdi-close-circle"
                outlined
                row-height="2"
                :rules="[((() => !!product.price) || 'This field is required')]"
              ></v-textarea>
              <v-select
                class="product-field"
                color="accent"
                prepend-icon="office-building"
                v-model="product.supplier"
                label="Supplier"
                outlined
                :items="suppliers"
                :rules="[((() => !!product.supplier) || 'This field is required')]"
              ></v-select>
            </div>
          </v-form>
          <span v-if="error" class="product-error">{{ error }}</span>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="d-flex justify-space-between product-actions">
          <v-btn
            color="primary"
            outlined
            @click="clearForm"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="submitRequest"
          >
            Submit product
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Product, Supplier } from "..//types/appTypes";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "productComponent"
})
export default class productComponent extends Vue {
  private moment = moment;
  private dialog = false;
  private product = {} as Product;
  private error = "";
  private suppliers = [] as string[];

  @Watch("product", { immediate: true, deep: true })
  onproductChange(): void {
    this.error = "";
  }

  private async submitRequest() {
    if(this.checkForm()) {
      try {
        const response = await FormsService.submitProduct(this.product);
        if(response && response.data && response.data.product) {
          this.clearForm();
          this.$store.commit("addNotification", 
            { message: "Product " + response.data.product.name + " successfully registered", 
              type: "info", 
              date: Date.now(),
              status: "new"
            });
        }
      } catch (error) {
        this.error = error.response.data.error;
        this.$store.commit("addNotification", 
          { message: error, 
            type: "error", 
            date: Date.now(), 
            status: "new"
          });
      }
    } else this.error = "Please fill all required fields";
  }

  private clearForm(): void {
    this.dialog = false;
    this.error = "";
    this.product = {} as Product;
  }

  private checkForm(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [key, value] of Object.entries(this.product)) {
      if(!value) return false;
    }
    return true;
  }

  private async fetchSupliers() {
    const suppliers = (await FormsService.getSuppliers()).data;
    suppliers.forEach( (supplier: Supplier) => {
      this.suppliers.push(supplier.name);
    });
  }
}
</script>>

<style lang="scss">
.product-wrapper {
  height: 100%;
  width: 100%;
}

.product-error {
  color: red;
}

.product-card-content {
  margin-top: 15px !important;
  margin-bottom: -10px !important;
}

.product-actions {
  padding: 10px 25px !important;
}
</style>>