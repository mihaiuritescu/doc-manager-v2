<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
        class="register-col"
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="accent"
            flat
          >
            <v-toolbar-title class="white--text">Register</v-toolbar-title>
          </v-toolbar>        
          <v-card-text>
            <h2 class="d-flex justify-center">Welcome to DocManager!</h2>
            <h3 class="login-description">
              Already have a DocManager account? 
              <a href="/login">Sign in</a>
            </h3>           
            <v-form>
              <div class="d-flex justify-space-between">
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="First name"
                  name="firstname"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="user.firstname"
                  :rules="[((() => !!user.firstname) || 'This field is required')]"
                ></v-text-field>
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="Last name"
                  name="lastname"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="user.lastname"
                  :rules="[((() => !!user.lastname) || 'This field is required')]"
                ></v-text-field>
              </div>
              <div class="d-flex justify-space-between">
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="Address"
                  name="address"
                  prepend-icon="mdi-map-marker"
                  type="text"
                  v-model="user.address"
                  :rules="[((() => !!user.address) || 'This field is required')]"
                ></v-text-field>
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="Postal code"
                  name="postalcode"
                  prepend-icon="mdi-barcode"
                  type="text"
                  v-model="user.postalcode"
                  :rules="[((() => !!user.postalcode) || 'This field is required')]"
                ></v-text-field>
              </div>
              <div class="d-flex justify-space-between">
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="City"
                  name="city"
                  prepend-icon="mdi-city"
                  type="text"
                  v-model="user.city"
                  :rules="[((() => !!user.city) || 'This field is required')]"
                ></v-text-field>
                <v-select
                  class="register-field"
                  color="accent"
                  prepend-icon="mdi-earth"
                  v-model="user.country"
                  label="Country"
                  :items="countries"
                  :rules="[((() => !!user.country) || 'This field is required')]"
                ></v-select>
              </div>
              <div class="d-flex justify-space-between">
                <v-select
                  class="register-field"
                  color="accent"
                  prepend-icon="mdi-briefcase"
                  v-model="user.occupation"
                  label="Occupation"
                  :items="occupations"
                  :rules="[((() => !!user.occupation) || 'This field is required')]"
                ></v-select>
                <v-select
                  class="register-field"
                  color="accent"
                  prepend-icon="mdi-account-group"
                  v-model="user.department"
                  label="Department"
                  :items="departments"
                  :rules="[((() => !!user.department) || 'This field is required')]"
                ></v-select>
              </div>
              <div class="d-flex justify-space-between">
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-at"
                  type="text"
                  v-model="user.email"
                  :rules="[((() => !!user.email) || 'This field is required'), checkEmail]"
                ></v-text-field>
                <v-text-field
                  class="register-field"
                  color="accent"
                  label="Phone"
                  name="phone"
                  prepend-icon="mdi-cellphone"
                  type="text"
                  v-model="user.phone"
                  :rules="[((() => !!user.phone) || 'This field is required')]"
                ></v-text-field>
              </div>
              <div class="d-flex justify-space-between">
                <v-text-field
                  class="register-field"
                  :append-icon="showPwd1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[() => !!user.password && user.password.length >= 8 || 'Password must be at least 8 characters long']"
                  :type="showPwd1 ? 'text' : 'password'"
                  prepend-icon="mdi-lock"
                  color="accent"
                  v-model="user.password"
                  name="password"
                  label="Password"
                  counter
                  @click:append="showPwd1 = !showPwd1"
                ></v-text-field>
                <v-text-field
                  class="register-field"
                  :append-icon="showPwd2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[() => !!pwd && pwd.length >= 8 || 'Password must be at least 8 characters long', matchPwd]"
                  :type="showPwd2 ? 'text' : 'password'"
                  prepend-icon="mdi-lock"
                  color="accent"
                  v-model="pwd"
                  name="password"
                  label="Confirm password"
                  counter
                  @click:append="showPwd2 = !showPwd2"
                ></v-text-field>
              </div>
            </v-form>
            <span v-if="error" class="register-error">
              {{error}}
            </span>
          </v-card-text>
          <v-card-actions class="justify-center align-center d-flex">
            <v-btn 
              @click="registerUser" 
              color="accent"
              class="login-button"
            >
              Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AuthService from "../services/AuthService";
import { User } from "../types/appTypes";

@Component({
  name: "RegisterComponent"
})
export default class RegisterComponent extends Vue {
  private user = {} as User;
  private error = "";
  private pwd = "";
  private showPwd1 = false;
  private showPwd2 = false;
  private occupations = ["Accountant", "Engineer", "Administrator", "Manager"];
  private departments = ["IT", "HR", "Security", "Marketing"];
  private countries = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla",
    "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas",
    "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia",
    "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam",
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands",
    "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia",
    "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire",
    "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
    "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana",
    "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar",
    "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
    "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India",
    "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait",
    "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya",
    "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius",
    "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat",
    "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles",
    "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands",
    "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn",
    "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
    "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon",
    "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic",
    "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay",
    "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)",
    "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];

  @Watch("user")
  private onUserDetailsChange() {
    this.error = "";
  }

  private async registerUser() {
    if(this.checkForm() && this.checkEmail() && this.matchPwd() === true) {
      try {
        const response = await AuthService.register(this.user);
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.$router.push("dashboard");
      } catch (error) {
        this.error = error.response.data.error;
      }
    } else this.error = "Please fill all the above fields!";
  }

  private checkForm() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [key, value] of Object.entries(this.user)) {
      if(!value) return false;
    }
    return true;
  }

  private checkEmail() {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(this.user.email) || "Invalid e-mail.";
  }

  private matchPwd() {
    return this.user.password === this.pwd || "Passwords do not match";
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.register-field {
  max-width: 280px !important;
}

.register-col {
  min-width: 640px !important;
  max-width: 640px !important;
}

.register-error {
  color: red;
  margin-left:  33px;
}
</style>
