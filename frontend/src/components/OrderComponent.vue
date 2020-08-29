<template>
  <div class="d-flex flex-column align-center justify-space-between order-wrapper">
    <v-icon class="app-widget-icon">mdi-domain</v-icon>
    <v-dialog
      v-model="dialog"
      width="70%"
      @click:outside="clearForm"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          @click="fetchProducts"
        >
          New order
        </v-btn>
      </template>

      <!-- Dialog content -->
      <div class="order-dialog-title headline">Order</div>
      <div class="d-flex justify-space-between order-dialog-wrapper">
        <v-card class="order-card order-product-list">
          <v-list two-line>
            <v-text-field
              v-model="searchValue"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              persistentHint
              :hint="hintMessage"
              clearable
              @click:clear="searchValue = ''"
              class="order-search"
            ></v-text-field>
            <v-list-item-group
              class="order-product-list-content"
              v-model="selected"
              active-class="green--text"
            >
              <template v-for="item in productList">
                <v-list-item 
                  :key="item.id"
                  @click="addInCart(item.id)"
                  class="order-list-item"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                    <v-list-item-subtitle 
                      class="text--primary order-product-supplier" 
                      v-text="item.supplier">
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text 
                      v-text="item.price + ' eur'" 
                      class="order-price">
                    </v-list-item-action-text>
                    <v-icon v-if="!item.selected" color="grey lighten-1">
                      mdi-cart-arrow-down
                    </v-icon>
                    <v-icon v-else color="blue">mdi-cart</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
          <!-- <v-card-text class="order-card-content">
            <span v-if="error" class="order-error">{{ error }}</span>
          </v-card-text> -->
        </v-card>
        <v-card class="order-card order-options">
          <v-card-title>Order details</v-card-title>
          <v-card-text class="order-cart-and-user d-flex flex-column justify-space-between">
            <div class="order-cart">
              <span class="d-flex order-cart-header">
                <span class="order-cart-product-name">Product</span>
                <span class="order-cart-quantity">Quantity</span>
                <span class="order-cart-price">Price</span>
              </span>
              <div class="order-cart-item-list">
                <div v-for="item in selectedProducts" :key="item.id" class="d-flex justify-center align-center order-cart-item">
                  <div class="order-cart-product-name">
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="order-cart-quantity">
                    <v-btn 
                      icon 
                      outlined 
                      :ripple="false" 
                      color="blue"
                      @click="item.quantity += 1"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <span>{{ item.quantity }}</span>
                    <v-btn 
                      icon 
                      outlined 
                      :ripple="false" 
                      color="blue"
                      :disabled="item.quantity < 1"
                      @click="item.quantity <= 1 ? item.selected = false : item.quantity -= 1"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </div>
                  <div class="order-cart-price">
                    <span>{{ item.price * item.quantity + ' eur'}}</span>
                  </div>
                </div>
                <div 
                  v-if="selectedProducts.length === 0" 
                  class="order-no-products-added d-flex justify-center align-center"
                >
                  <div class="d-flex">
                    No products added in cart
                  </div>
                </div>
              </div>
              <span class="d-flex order-cart-footer">
                <span class="order-cart-product-name">Total</span>
                <span class="order-cart-quantity">{{ totals.totalQuantity }}</span>
                <span class="order-cart-price">{{ totals.totalPrice + ' eur' }}</span>
              </span>
            </div>
            <div class="order-user-details d-flex-column">
              <div class="order-cart-user-details-text">User details</div>
              <div class="d-flex justify-space-between">
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="First name"
                  name="firstname"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="user.firstname"
                  disabled
                ></v-text-field>
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="Last name"
                  name="lastname"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="user.lastname"
                  disabled
                ></v-text-field>
              </div>
              <div class="d-flex justify-space-between">
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="E-mail"
                  name="email"
                  prepend-icon="mdi-at"
                  type="text"
                  v-model="user.email"
                  disabled
                ></v-text-field>
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="Phone"
                  name="phone"
                  prepend-icon="mdi-phone"
                  type="text"
                  v-model="user.phone"
                  disabled
                ></v-text-field>
              </div>
              <div class="d-flex justify-space-between order-dialog-footer">
                <v-btn
                  color="primary"
                  outlined
                  @click="clearForm"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  :disabled="selectedProducts.length === 0"
                  @click="submitRequest"
                >
                  Submit order
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { User, ComplexProduct, Order, SimpleProduct } from "..//types/appTypes";
import { mapState } from "vuex";
import FormsService from "../services/FormsService";
import moment from "moment-business-days";

@Component({
  name: "OrderComponent",
  computed: mapState(["user"])

})
export default class OrderComponent extends Vue {
  private moment = moment;
  private dialog = false;
  private order = {} as Order;
  private error = "";
  private products = [] as ComplexProduct[];
  private selected = [];
  private user!: User;
  private searchValue = "";
  private hintMessage = "Click on any item to add it to cart";
  private localSelectedProducts = this.selectedProducts;

  @Watch("order", { immediate: true, deep: true })
  onOrderChange(): void {
    this.error = "";
  }

  get productList(): ComplexProduct[] {
    const search = this.searchValue ? this.searchValue.toLowerCase() : "";

    if (!search) return this.products;
    const result = this.products.filter(item => {
      const text = item.name.toLowerCase();
      return text.indexOf(search) > -1;
    });
    if (result && result.length === 0) this.hintMessage = "No results";
    else this.hintMessage = "Click on any item to add it to cart";
    return result;
  }

  get selectedProducts(): ComplexProduct[] {
    return this.products.filter(item => item.selected);
  }

  get totals(): { totalQuantity: number, totalPrice: number} {
    let totalQuantity = 0;
    let totalPrice = 0;
    this.products.forEach(item => {
      if (item.selected) {
        totalQuantity += item.quantity;
        totalPrice += item.quantity * item.price;
      }
    });
    return { totalQuantity, totalPrice };
  }

  private addInCart(id: number): void {
    const idx = this.products.findIndex(product => product.id === id);
    if(idx >= 0) {
      Vue.set(this.products[idx], "selected", !this.products[idx].selected);
      Vue.set(this.products[idx], "quantity", 1);
    }
  }

  private async submitRequest() {
    this.products.forEach(item => {
      if (item.selected) {
        this.order.products.push({ productId: item.id, quantity: item.quantity } as SimpleProduct);
      }
    });
    this.order.totalPrice = this.totals.totalPrice;
    this.order.status = "new";
    try {
      const response = await FormsService.submitOrder(this.order);
      if(response && response.data) {
        this.clearForm();
        this.$store.commit("addNotification", 
          { message: "Order with number " + response.data.orderNumber + " was successfully registered", 
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
  }

  private clearForm(): void {
    this.dialog = false;
    this.error = "";
    this.order.totalPrice = 0;
    this.order.products = [] as SimpleProduct[];
  }

  private checkForm() {
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // for (let [key, value] of Object.entries(this.order)) {
    //   if(!value) return false;
    // }
    // return true;
  }

  private async fetchProducts() {
    this.products = (await FormsService.getProducts()).data;
    this.order = {
      userId: this.user.id,
      products: [] as SimpleProduct[],
      totalPrice: 0
    } as Order;
  }
}
</script>>

<style lang="scss">
.order-wrapper {
  height: 100%;
  width: 100%;
}

.order-dialog-title {
  width: 100%;
  height: 64px;
  background-color: #4caf50;
  color: white;
  padding: 16px;
}

.order-dialog-wrapper {
  width: 100% !important;
  height: 775px !important;
  background-color: white;
  padding: 15px !important;
}

.order-dialog-footer {
  background-color: white;
  padding: 10px 25px !important;
}

.order-card {
  width: 49% !important;
  max-height: 100% !important;
  padding: 15px !important;
}

// .order-product-list {
// }

// .order-options {
// }

.order-product-list-content {
  max-height: 630px !important;
  overflow: auto;
}

.order-cart-item-list {
  border-bottom: solid 1px rgba(0, 0, 0, 0.2) !important;
  min-height: 310px;
  max-height: 310px;
  margin-bottom: 10px;
  overflow: auto;
}

.order-list-item {
  border-bottom: solid 1px rgba(0, 0, 0, 0.2) !important;
}

.order-search {
  padding: 0 16px !important;
  margin-bottom: 15px;
}

.order-product-supplier {
  font-style: italic;
}

.order-price {
  font-size: 16px !important;
  font-weight: bold;
}

.order-error {
  color: red;
}

.order-cart {
  font-size: 16px !important;
  margin-bottom: 20px;
}

.order-cart-header, .order-cart-footer {
  width: 100%;
  margin-bottom: 10px;
  font-weight: bold;
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
}

.order-no-products-added {
  height: 305px;
}

.order-cart-item {
  width: 100%;
  height: 28px;
}

.order-cart-product-name {
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.order-cart-product-name span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.order-cart-quantity {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 20%;
}

.order-cart-quantity span {
  margin: 0 4px;
}

.order-cart-quantity .v-btn {
  height: 24px !important;
  width: 24px !important;
}

.order-cart-quantity .v-btn:hover {
  background-color: #0c5df318;
}

.order-cart-quantity .v-btn:active {
  background-color: #0c5df33d;
}

.order-cart-quantity .v-icon {
  height: 20px !important;
  width: 20px !important;
  font-size: 20px !important;
}

.order-cart-price {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 20%;
  padding-right: 10px;
}

.order-cart-and-user {
  height: calc(100% - 64px) !important;
  padding-bottom: 0 !important;
}

.order-cart-user-details-text {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: .0125em;
  line-height: 2rem;
  word-break: break-all;
  color: rgba(0,0,0,.87);
  margin-bottom: 10px;
}
</style>>