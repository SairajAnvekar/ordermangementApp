<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <v-container grid-list-md text-xs-center>
    
          <v-layout row wrap > 
            <v-flex xs6>
              <v-card dark color="blue-grey darken-2 h-100" >
                  <v-card-text class="px-0">
                    <div class="headline">Total Order for Today</div>
                    <span>
                      <h1>{{totalOrders}}</h1>
                    </span>
                  </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs6>
              <v-card dark color="blue-grey darken-2 h-100" >
                  <v-card-text class="px-0">
                    <div class="headline">Total Payment Today</div>
                    <span>
                       <h1>{{totalPayment}}</h1>
                    </span>
                      <span class="mode"><b>Cash :</b> {{cashMode['Cash']}} </span>
                  <span  class="mode" ><b>Cheque :</b> {{cashMode['Cheque'] || 0 }} </span> 
                  <span  class="mode"><b>Card : </b>{{cashMode['Card'] || 0 }} </span>
                  </v-card-text>
              </v-card>
            </v-flex>
 
             <v-flex xs12>
              <v-card>                
              <img src='@/assets/lorenz-studio.jpg' width='100%' height=400>
              </v-card>
              
            </v-flex> 
            
           
          </v-layout>

 
        
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
<style>
.align-left{
  text-align: left;
}
.v-image__image--cover{
  background-size: 100% 100% !important;
}
.mode{
  font-size: 18px;
}
</style>
