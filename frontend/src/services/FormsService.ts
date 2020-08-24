import Api from "@/services/ApiService";

export default {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  submitHolidayRequest(request: unknown) {
    return Api().post("holiday-request", request);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  submitReport(report: unknown) {
    return Api().post("report", report);
  }
};
