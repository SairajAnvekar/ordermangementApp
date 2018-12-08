<template>
  <v-content>
    <v-layout>
      <app-header></app-header>

      <v-container>
        <v-card-title>
          <v-spacer></v-spacer>
          <div>
            <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition"
              offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="startDate">
              <v-text-field slot="activator" label="From" v-model="startDate" required prepend-icon="event" ></v-text-field>
              <v-date-picker v-model="startDate" @change="saveDate" no-title scrollable>
              </v-date-picker>
            </v-menu>
          </div>
           <v-spacer></v-spacer>
          <div>
            <v-menu ref="endDate" lazy :close-on-content-click="false" v-model="endDatePicker" transition="scale-transition"
              offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="endDate">
              <v-text-field slot="activator" label="To" v-model="endDate"></v-text-field>
              <v-date-picker v-model="endDate" @change="saveEndDate" no-title scrollable>
              </v-date-picker>
            </v-menu>
          </div>
         <v-spacer></v-spacer>
          <v-btn color="info" class="" onclick="" @click.native="searchOrder">Search</v-btn>
          <v-btn color="info" class="" onclick="" @click.native="exportOrder">Export</v-btn>
        </v-card-title>
        <v-data-table hide-actions :headers="headers" :search="search" :items="orderList" item-key="name"
          class="elevation-1 order-table">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.paymentDetails._id }}</td>
            <td>{{ props.item.order_no }}</td>
            <td>{{ props.item.paymentDetails.payment_date }}</td>
            <td>{{ props.item.paymentDetails.payment_time }}</td>
            <td>{{ props.item.paymentDetails.amount }}</td>
            <td>{{ props.item.paymentDetails.mode }}</td>        
          </template>
          <template slot="footer">

            <tr>
              
              <td>Total Amount</td>
              <td>{{footerData.totalAmt}}</td>               
            </tr>
          </template>
        </v-data-table>


   

      </v-container>
      <app-footer></app-footer>
    </v-layout>
  </v-content>
</template>
<script>
  import Axios from 'axios'
  import Authentication from '@/components/pages/Authentication'
  import APIurlConfig from '../../apiConfig'
  import ExportToExcel from '../../libary/exportToExcel'
  import moment from 'moment'
  import DateOnly from 'dateonly'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  export default {
    data() {
      return {
        validated: 1,
        search: '',
        loginPage: false,
        orderList: [],
        status: 'all',
        menu: false,
        endDatePicker: false,
        footerData: {
          totalAmt: 0,
          totalPaid: 0,
          balance: 0
        },
        endDate:  new Date().toISOString().substr(0, 10),
        startDate: new Date().toISOString().substr(0, 10),
        statusItem: ['all', 'pending', 'ready', 'delivered'],
        headers: [{
            text: 'Payment Id',
            align: 'center',
            value: 'order_no',
            sortable: false,
          },
          {
            text: 'Order No',
            align: 'center',
            value: 'order_no'
          },
          {
            text: 'Payment Date',
            value: 'status'
          },
          {
            text: 'Payment Time',
            value: 'customer_name'
          },
          {
            text: 'Amount',
            align: 'center',
            value: 'customer_name'
          },
          {
            text: 'Mode',
            align: 'center',
            value: 'grand_total'
          },
        ],
      }
    },
    mounted() {
      this.getAllOrder()

    },
    methods: {
      getAllOrder(context) {
        this.orderLoading = true,
          Axios.get(`${apiURL}/api/v1/orderPaymentReports`, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            },
             params: {
              startDate: this.startDate,
              endDate: this.endDate,          
            }


          }).then(({
            data
          }) => (
            this.orderList =this.formateData(data),        
            this.orderLoading = false,
            console.log(data)
          ))
      },
      searchOrder(context) {
        this.orderLoading = true,
          Axios.get(`${apiURL}/api/v1/orderPaymentReports`, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            },
            params: {
              startDate: this.startDate,
              endDate: this.endDate,          
            }

          }).then(({
            data
          }) => (
            this.orderList = this.formateData(data),
            this.needSetup = data.length > 0 ? false : true,
            this.orderLoading = false,
            console.log(data)
          ))
      },


      formateDate(date) {
        return date ? moment(date).format('YYYY-MM-DD') : "";
      },

      formateTime(date) {
        return date ? moment(date).format('LLLL') : "";
      },
      formateData(orders) {
        this.footerData = {
            totalAmt: 0,
           
          },
          orders.forEach((order) => {
            order.paymentDetails.payment_time = this.formateTime(order.paymentDetails.payment_date);          
            order.paymentDetails.payment_date = this.formateDate(order.paymentDetails.payment_date);          
            this.footerData.totalAmt =  this.footerData.totalAmt + order.paymentDetails.amount;
            console.log( order.paymentDetails.amount,this.footerData.totalAmt);
         
         });

        return orders;
      },
      exportOrder() {
        const table = document.querySelector('.order-table table tbody').innerHTML;
        const footer = document.querySelector('.order-table table tfoot').innerHTML;
        console.log(table + footer);
        var exportToExcel = new ExportToExcel(table + footer, this.headers);
        exportToExcel.generate(),
          exportToExcel.download()
      },
      saveDate(date) {
        this.$refs.menu.save(date);
      },
      saveEndDate(date) {
        this.$refs.endDate.save(date);
      },


    }
  }
</script>