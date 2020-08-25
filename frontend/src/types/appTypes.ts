export interface Credentials {
  email: string,
  password: string
}

export interface User {
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  address: string,
  country: string,
  city: string,
  postalCode: string,
  phone: string,
  occupation: string,
  department: string
}

export interface Notification {
  message: string,
  type: string,
  date: number,
  status: string
}

export interface HolidayRequest {
  userEmail: string,
  startDate: string
  endDate: string,
  contact: string,
  status: string
}

export interface Report {
  userEmail: string,
  address: string,
  phone: string,
  locationManager: string,
  equipmentType: string,
  equipmentDetails: string,
  problemsFound: string,
  observations: string,
  status: string
}

export interface Supplier {
  name: string,
  address: string,
  phone: string,
  email: string,
}

export interface Product {
  name: string,
  description: string,
  price: number,
  supplier: string,
}