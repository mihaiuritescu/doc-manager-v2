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