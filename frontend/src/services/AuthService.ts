import Api from '@/services/ApiService'

export default {
  register (credentials: any) {
    return Api().post('register', credentials)
  }
}

// AuthenticationService.register({
//   email: 'sasas',
//   password: '1111'
// })
