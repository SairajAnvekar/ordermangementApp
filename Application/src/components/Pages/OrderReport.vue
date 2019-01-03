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
            <v-text-field slot="activator" label="From" v-model="startDateFormatted" required
              prepend-icon="event" :readonly="view"></v-text-field>
            <v-date-picker  v-model="startDate" @change="saveDate" no-title scrollable>
            </v-date-picker>
          </v-menu>
          </div>
          <div>
            <v-menu ref="endDate" lazy :close-on-content-click="false" v-model="endDatePicker" transition="scale-transition"
            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="endDate">
            <v-text-field slot="activator" label="To" v-model="endDateFormatted"></v-text-field>
            <v-date-picker  v-model="endDate" @change="saveEndDate" no-title scrollable>
            </v-date-picker>
            </v-menu>
          </div>
          <v-flex xs12 sm6 md3>                   
            <v-select :items="statusItem" v-model="status" ref="status"  label="Status"></v-select>
          </v-flex>


         
              <v-btn color="info" class="" onclick="" @click.native="searchOrder">Search</v-btn>
                  <v-btn color="info" class="" onclick="" @click.native="exportOrder">Export</v-btn>
        </v-card-title>
        <v-data-table hide-actions  :headers="headers" :search="search" :items="orderList" item-key="name" :rows-per-page-items="pageSetup"
          :loading="orderLoading" class="elevation-1 order-table">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.order_no }}</td>
            <td>{{ props.item.order_date }}</td>
             <td>{{ props.item.status }}</td>
            <td>{{ props.item.customer_name }}</td>
            <td>{{ props.item.totalItem }}</td>
            <td>{{ props.item.grand_total }}</td>            
            <td>{{ props.item.paid_amount }}</td>
            <td>{{ props.item.balance }}</td>
            <td>{{ props.item.delivery_date}}</td>
          </template>
           <template slot="footer">
              
              <tr><td><b>Total Order</b></td> <td> {{footerData.count}}</td> <td>Total Amount</td> <td>{{footerData.totalAmt}}</td> <td>Payment Received</td><td>{{footerData.totalPaid}} </td> <td>Balance</td><td>{{footerData.balance}}</td></tr>            
           </template>
        </v-data-table>


        <!--  progress bar !-->
        <v-dialog v-model="processing" hide-overlay persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Please wait
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>

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
  data () {
    return {
      validated : 1,
      search: '',
      loginPage : false, 
      orderList: [],
      status:'all',
      menu: false,
      endDatePicker:false,
      footerData:{
        totalAmt:0,       
        totalPaid:0,
        balance:0
      },
      endDate:"",
      startDate:'',
        statusItem: ['all','pending','ready','delivered'],
       headers: [{
            text: 'Order No',
            align: 'center',
            value: 'order_no',
            sortable: false,
          },
             {
            text: 'Order Date',
            align: 'center',
            value: 'order_date'
          },
            {
            text: 'Status',           
            value: 'status'
          },
          {
            text: 'Customer Name',          
            value: 'customer_name'
          },
           {
            text: 'Total Item',
            align: 'center',
            value: 'customer_name'
          },
          {
            text: 'Net Total',
            align: 'center',
            value: 'grand_total'
          },    
      
          {
            text: 'Paid Amount',
            align: 'center',
            value: 'status'
          },
           {
            text: 'Balance Amount',
            align: 'center',
            value: 'status'
          },
            {
            text: 'Deleivery Date',
            align: 'center',
            value: 'deleiver_date'
          },
        ],   
    }
  },
  computed: {
      startDateFormatted () {
        console.log(this.startDate)
        return this.formatStringDate(this.startDate)
      },
       endDateFormatted () {
        console.log(this.endDate)
        return this.formatStringDate(this.endDate)
      }
    },
  mounted () {
       this.getAllOrder()
   
  },
  methods: {
        getAllOrder(context) {
        this.orderLoading = true,
          Axios.get(`${apiURL}/api/v1/orderReports`, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            },
            
          }).then(({
            data
          }) => (
            this.orderList = this.formateData(data),
            this.needSetup = data.length > 0 ? false : true,
            this.orderLoading = false,
            console.log(data)
          ))
      },
 searchOrder(context) {
        this.orderLoading = true,
          Axios.get(`${apiURL}/api/v1/orderReports`, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            }, 
            params: {           
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.status,
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
        return date ? moment(new DateOnly(date)).format('DD-MM-YYYY') : "";
      },
      formateData(orders){
        this.footerData={
        totalAmt:0,       
        totalPaid:0,
        balance:0,
        count:0,     
      },
        orders.forEach((order)=>{
          order.order_date= this.formateDate( order.order_date);
          order.delivery_date= this.formateDate( order.delivery_date)
          order.grand_total= Math.round(order.grand_total);
          order.balance=  order.grand_total - order.paid_amount
          order.totalItem = order.orderDetails.length
          this.footerData.totalAmt=  order.grand_total + this.footerData.totalAmt;
          this.footerData.balance=  this.footerData.balance + order.balance;
          this.footerData.totalPaid=  this.footerData.totalPaid + order.paid_amount; 
          this.footerData.count= this.footerData.count + 1 ; 

       });
        
       return orders;
      },
      exportOrder(){
        const table  = document.querySelector('.order-table table tbody').innerHTML; 
        const footer  = document.querySelector('.order-table table tfoot').innerHTML;  
        console.log(table+footer);    
        var exportToExcel = new ExportToExcel(table+footer,this.headers);
        exportToExcel.generate(),
        exportToExcel.download()  
      },
      saveDate(date) {
        this.$refs.menu.save(date);        
      },
      saveEndDate(date) {
        this.$refs.endDate.save(date);        
      },
       formatStringDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },


   
  }
}
</script>