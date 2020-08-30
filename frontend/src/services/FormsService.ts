/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Api from "@/services/ApiService";

export default {
  submitHolidayRequest(request: unknown) {
    return Api().post("holiday-request", request);
  },

  submitReport(report: unknown) {
    return Api().post("report", report);
  },

  submitSupplier(supplier: unknown) {
    return Api().post("supplier", supplier);
  },
  getSuppliers() {
    return Api().get("supplier");
  },

  submitProduct(product: unknown) {
    return Api().post("product", product);
  },
  updateProducts(product: unknown) {
    return Api().put("product", product);
  },
  getProducts() {
    return Api().get("product");
  },

  submitOrder(order: unknown) {
    return Api().post("order", order);
  },
  getOrders() {
    return Api().get("order");
  },

  getDepartments() {
    return Api().get("department");
  },

  getOccupations() {
    return Api().get("occupation");
  },

  getEmployees() {
    return Api().get("employee");
  },
  updateEmployees(employee: unknown) {
    return Api().put("employee", employee);
  }
};
