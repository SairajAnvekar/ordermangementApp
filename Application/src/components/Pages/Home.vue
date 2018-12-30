<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <v-container>
        <v-list>
          <v-layout row wrap header>
            <v-flex xs6>
              <v-card color="blue-grey darken-2" class="white--text">
                <v-card-title primary-title>
                  <div>
                    <div class="headline">Total Order for Today</div>
                    <span>
                      <h1>{{totalOrders}}</h1>
                    </span>
                  </div>
                </v-card-title>
                 <v-card-text class="align-left">
                  <br> 
                </v-card-text>

              </v-card>
            </v-flex>
            <v-flex xs6>
              <v-card color="blue-grey darken-2" class="white--text">
                <v-card-title primary-title>
                  <div>
                    <div class="headline">Total Payment Today</div>
                    <span>
                      <h1>{{totalPayment}}</h1>
                    </span>
                  </div>

                </v-card-title>
                <v-card-text class="align-left">

                  <span class="headline">Cash : {{cashMode['Cash']}} </span>
                  <span class="headline">Cheque : {{cashMode['Cheque'] || 0 }} </span> 
                  <span class="headline">Card : {{cashMode['Card'] || 0 }} </span>

                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-list>
      </v-container>
      <app-footer></app-footer>
    </v-layout>
  </v-content>
</template>
<script>
  import Axios from 'axios'
  import Authentication from '@/components/pages/Authentication'
  import APIurlConfig from '../../apiConfig'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  export default {
    data() {
      return {
        validated: 1,
        loginPage: false,
        totalOrders: 0,
        totalPayment: 0,
        cashMode: {},
      }
    },
    mounted() {
      this.test();
      this.getAllOrder();
      this.getAllOrderPayment();
    },
    methods: {
      test() {
        console.log(this.$vuetify.theme);
      },
      getAllOrderPayment(context) {
        this.orderLoading = true,
          Axios.get(`${apiURL}/api/v1/orderPaymentReports`, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            },
            params: {
              startDate: new Date().toISOString().substr(0, 10),
              endDate: new Date().toISOString().substr(0, 10),
            }


          }).then(({
            data
          }) => {
            let byMode = [];
            data.forEach(order => {
              this.totalPayment = this.totalPayment + order.paymentDetails.amount;
              byMode[order.paymentDetails.mode] = (byMode[order.paymentDetails.mode] || 0) + order.paymentDetails
                .amount;
            })
            this.cashMode = byMode;
            console.log({
              byMode
            });
          })
      },

      getAllOrder(context) {
        this.orderLoading = true,
          Axios.get(`${apiURL}/api/v1/orderReports`, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            },
            params: {
              startDate: new Date().toISOString().substr(0, 10),
              endDate: new Date().toISOString().substr(0, 10),
            }

          }).then(({
            data
          }) => (
            this.totalOrders = (data.length)
          ))
      },

    }
  }

</script>
