export interface Credentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address: string;
  country: string;
  city: string;
  postalCode: string;
  phone: string;
  occupation: string;
  department: string;
  admin: boolean;
}

export interface Notification {
  message: string;
  type: string;
  date: number;
  status: string;
}

export interface HolidayRequest {
  userEmail: string;
  startDate: string
  endDate: string;
  contact: string;
  status: string;
}

export interface Report {
  userEmail: string;
  address: string;
  phone: string;
  locationManager: string;
  equipmentType: string;
  equipmentDetails: string;
  problemsFound: string;
  observations: string;
  status: string;
}

export interface Supplier {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  supplier: string;
}

export interface ComplexProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  supplier: string;
  supplierId: boolean;
  selected: boolean;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  edited: boolean;
  deleted: boolean;
}

export interface SimpleProduct {
  productId: number;
  quantity: number
}

export interface Order {
  products: SimpleProduct[];
  totalPrice: number;
  status: string;
}

export interface ComplexOrder {
  id: number;
  userId: number;
  userName: string;
  userDept: string;
  userOcc: string;
  totalValue: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
}

export interface Employee {
  address: string;
  city: string;
  country: string;
  createdAt: string;
  department: number;
  departmentName: string;
  email: string;
  firstname: string;
  id: number;
  lastname: string;
  occupation: number;
  occupationName: string;
  phone: string;
  postalcode: string;
  updatedAt: string;
  edited: boolean;
  deleted: boolean;
  admin: boolean;
}

export interface ComplexHolidayRequest {
  contact: string;
  createdAt: string;
  endDate: string;
  id: number;
  startDate: string;
  status: string;
  updatedAt: string;
  userDept: string;
  userId: number;
  userName: string;
  userOcc: string;
  edited: boolean;
}

export interface ComplexReport {
  address: string;
  createdAt: string;
  equipmentDetails: string;
  equipmentType: string;
  id: number;
  locationManager: string;
  observations: string;
  phone: string;
  problemsFound: string;
  status: string;
  updatedAt: string;
  userDept: string;
  userId: number;
  userName: string;
  userEmail: string;
  userOcc: string;
  edited: boolean;
}