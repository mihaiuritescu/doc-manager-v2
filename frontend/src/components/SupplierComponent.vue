<template>
  <div class="d-flex flex-column align-center justify-space-between supplier-wrapper">
    <v-icon class="app-widget-icon">mdi-domain</v-icon>
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
        >
          New Supplier
        </v-btn>
      </template>

      <!-- Dialog content -->
      <v-card>
        <v-card-title class="headline primary white--text">
          Supplier
        </v-card-title>

        <v-card-text class="supplier-card-content">
          <v-form>
            <div class="d-flex-column">
              <v-textarea
                class="supplier-field"
                color="accent"
                label="Name"
                name="supplierName"
                prepend-icon="mdi-account"
                type="text"
                auto-grow
                row-height="2"
                clearable
                clear-icon="mdi-close-circle"
                outlined
                v-model="supplier.name"
                :rules="[((() => !!supplier.name) || 'This field is required')]"
              ></v-textarea>
              <v-textarea
                class="supplier-field"
                color="accent"
                label="Email"
                name="email"
                prepend-icon="mdi-at"
                type="text"
                clearable
                clear-icon="mdi-close-circle"
                auto-grow
                row-height="2"
                outlined
                v-model="supplier.email"
                :rules="[((() => !!supplier.email) || 'This field is required'), checkEmail]"
              ></v-textarea>
              <v-textarea
                v-model="supplier.address"
                class="supplier-field"
                color="accent"
                label="Address"
                name="address"
                prepend-icon="mdi-map-marker"
                type="text"
                auto-grow
                clearable
                clear-icon="mdi-close-circle"
                outlined
                row-height="2"
                :rules="[((() => !!supplier.address) || 'This field is required')]"
              ></v-textarea>
              <v-textarea
                class="supplier-field"
                color="accent"
                v-model="supplier.phone"
                label="Phone"
                name="phone"
                prepend-icon="mdi-phone"
                type="text"
                auto-grow
                clearable
                clear-icon="mdi-close-circle"
                outlined
                row-height="2"
                :rules="[((() => !!supplier.phone) || 'This field is required')]"
              ></v-textarea>
            </div>
          </v-form>
          <span v-if="error" class="supplier-error">{{ error }}</span>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="d-flex justify-space-between supplier-actions">
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
            Submit supplier
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Supplier } from "..//types/appTypes";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "SupplierComponent"
})
export default class SupplierComponent extends Vue {
  private moment = moment;
  private dialog = false;
  private supplier = {} as Supplier;
  private error = "";

  @Watch("supplier", { immediate: true, deep: true })
  onsupplierChange(): void {
    this.error = "";
  }

  private async submitRequest() {
    if(this.checkForm() && this.checkEmail() === true) {
      try {
        const response = await FormsService.submitSupplier(this.supplier);
        if(response && response.data) {
          this.clearForm();
          this.$store.commit("addNotification", 
            { message: "Supplier " + response.data.supplier.name + " was successfully registered", 
              type: "info", 
              date: Math.round(new Date(response.data.supplier.createdAt).getTime()), 
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
    this.supplier = {} as Supplier;
  }

  private checkForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [key, value] of Object.entries(this.supplier)) {
      if(!value) return false;
    }
    return true;
  }

  private checkEmail() {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(this.supplier.email) || "Invalid e-mail.";
  }
}
</script>>

<style lang="scss">
.supplier-wrapper {
  height: 100%;
  width: 100%;
}

.supplier-error {
  color: red;
}

.supplier-card-content {
  margin-top: 15px !important;
  margin-bottom: -10px !important;
}

.supplier-actions {
  padding: 10px 25px !important;
}
</style>>