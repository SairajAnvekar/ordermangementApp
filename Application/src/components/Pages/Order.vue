<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
        <v-snackbar v-model="snackbar" :color="snackbarColor" :top="true">
        {{snackbarMessage}}
        <v-btn color="white" flat @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
      <v-container>
        <v-dialog dark v-model="createOrderDialog" :lazy=true fullscreen transition="dialog-bottom-transition" :overlay="false"
          scrollable>
          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="createOrderDialog = false,reset() " dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Add Order</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat v-if="!order._id" @click.native="save()">Save</v-btn>
                <v-btn dark flat v-if="needSetup" @click.native="setup()">setup</v-btn>
                <v-btn dark flat v-if="order._id" @click.native="update()">Update</v-btn>
                <v-btn dark flat v-if="order._id" @click.native="printElem()">Print</v-btn>

              </v-toolbar-items>
            </v-toolbar>
            <v-card-text>

              <v-container grid-list-md>
                <v-form ref="form" v-model="valid">

                  <v-layout wrap>
                    <v-flex xs12 sm6 md2>
                      <v-text-field class="order_no" label="Order No" v-model="order.order_no" disabled></v-text-field>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs12 sm6 md2>
                      <v-text-field label="Customer Name " ref="customer_name" required v-model="order.customer_name"
                        :rules="[rules.required]" :readonly="view" v-if="createOrderDialog" autofocus></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md2>
                      <v-text-field label="Customer Phone No " required v-model="order.customer_tel" :rules="[rules.required]"
                        :readonly="view"></v-text-field>
                    </v-flex>
                    <v-flex xs9 sm6 md3>
                      <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition"
                        offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="order.delivery_date">
                        <v-text-field slot="activator" label="Date Of Delivery" v-model="formatedDeliveryDate" required
                          prepend-icon="event" :readonly='true'></v-text-field>
                        <v-date-picker required :rules="[rules.required]" :readonly="view" v-model="order.delivery_date"
                          @change="saveDate" no-title scrollable>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>


                    <v-flex xs12 sm6 md3>
                      <v-select :items="statusItem" :readonly="isStatusReadOnly" ref="status" required label="Status"
                        v-model="order.status" :rules="[rules.required]"></v-select>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <v-data-table hide-actions :headers="orderDetailHeader" :items="order.orderDetails" item-key="name"
                        class="elevation-1 order">
                        <template slot="items" slot-scope="props">
                          <td>
                            <v-select class="productSelect" autofocus ref="prod" v-if="!props.item._id" required :items="productList"
                              :rules="[rules.required]" v-model="props.item.productId" item-value="_id" item-text="customName"
                              autocomplete single-line @input="activeProduct(props.item) " :readonly="view"></v-select>
                            <v-text-field v-if="props.item._id" v-model="props.item.productName" :readonly="true"></v-text-field>

                          </td>
                          <td>
                            <div v-if="props.item.hasSize" calss="xs4 sm4 md6" style="display:inline-flex;max-width:200px">
                              <v-flex xs4 sm4 md6>
                                <v-text-field v-model="props.item.size.height" type="number" min=0 @input="calculateAmount(props.item)"
                                  :rules="[rules.required]" :readonly="view"></v-text-field>
                              </v-flex>
                              <v-flex xs4 sm4 md6>
                                <v-text-field v-model="props.item.size.width" type="number" min=0 @input="calculateAmount(props.item)"
                                  :rules="[rules.required, rules.validateNum]" :readonly="view"></v-text-field>
                              </v-flex>
                            </div>

                          </td>

                          <td>
                            <v-text-field v-if="props.item.hasSize" :readonly="true" tabindex="-1" v-model="props.item.rate"
                              @input="calculateAmount(props.item)"></v-text-field>
                          </td>
                          <td class="text-xs-center">
                            <v-text-field v-model="props.item.price" :readonly="true" tabindex="-1" min=0 type="number"
                              @input="calculateAmount(props.item)"></v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="props.item.qty" :readonly="view" min=0 type="number" @input="calculateAmount(props.item)"></v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="props.item.amt" :readonly="view"></v-text-field>
                          </td>
                          <td>
                            <v-btn fab :disabled="view" color="indigo" small @click.native="removeItem(props.index)">
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </td>
                        </template>
                        <template slot="footer">
                          <tr>
                            <td>
                              <v-btn fab :disabled="view" color="indigo" dark small top @click.native="addItem()">
                                <v-icon dark>add</v-icon>
                              </v-btn>
                            </td>
                            <td colspan="4" class="text-xs-right"><strong>Items</strong></td>
                            <td colspan="1" class="text-xs-right">{{ order.items }}</td>
                          </tr>
                          <tr>
                            <td colspan="5" class="text-xs-right"><strong> Amount</strong></td>
                            <td class="text-xs-right">{{ order.total }}</td>
                          </tr>
                          <tr>
                            <td colspan="4" class="text-xs-right"><strong>Discount</strong></td>
                            <td class="text-xs-right">
                              <v-text-field v-model="order.discount_amt" @input="calculateDiscount"  :readonly="isStatusReadOnly" min=0 type="number"></v-text-field>
                            </td>
                            <td class="text-xs-right">{{ discountedAmt() }}</td>
                          </tr>
                          <tr>
                            <td colspan="4" class="text-xs-right"><strong>Tax %</strong></td>
                            <td class="text-xs-right">
                              <v-text-field v-model="order.tax" @input="calculateTax()" :readonly="isStatusReadOnly" min=0 type="number"></v-text-field> 
                            </td>
                            <td class="text-xs-right">{{ order.taxAmt }}</td>
                          </tr>
                          <tr>
                            <td colspan="5" class="text-xs-right"><strong>Total Amount</strong></td>
                            <td class="text-xs-right">{{ order.grand_total }}</td>
                          </tr>
                          <tr>
                            <td colspan="5" class="text-xs-right"><strong>Paid Amount</strong></td>
                            <td class="text-xs-right">{{ order.paid_amount }}</td>
                          </tr>
                          <tr>

                            <td colspan="5" class="text-xs-right"><strong>Rounding Off</strong></td>
                            <td class="text-xs-right">{{ order.roundOff }}</td>

                          </tr>

                          <tr>
                            <td>
                              <v-btn color="indigo" :disabled="!valid" indigo dark small @click.native="paymentDialog = true,payment.amount=0,calculateBalance(),checkFinalPayment()">
                                Payement
                              </v-btn>
                            </td>
                            <td colspan="4" class="text-xs-right"><strong>Payeble Amount</strong></td>
                            <td class="text-xs-right">{{order.net_payable}}</td>
                          </tr>

                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>
                </v-form>

              </v-container>
              <small>*indicates required field</small>

            </v-card-text>
          </v-card>

        </v-dialog>
        <v-dialog v-model="paymentDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Payment</span>
              <v-btn color="blue darken-1" flat @click.native="paymentDialog = false">Close</v-btn>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-form ref="paymentForm" v-model="validPay">
                  <v-layout wrap>
                    <v-flex xs12 sm12 md6>
                      <v-text-field label="Amount*" v-model="payment.amount" type='number' min=0 required @input="calculateBalance()"
                        :rules="[rules.validateNum,rules.checkAmount]"   v-if="paymentDialog" autofocus :readonly=!paymentEnabled></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field label="Amount Paid " disabled v-model="order.paid_amount" required @input="calculateBalance()"
                        :rules="[rules.validateNum]"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-select :items="paymentType" label="Payment Mode" v-model="payment.mode"></v-select>
                    </v-flex>

                    <v-flex xs12 sm12 md6>
                      <v-text-field label="Balance*" disabled v-model="order.balance" required></v-text-field>
                    </v-flex>

                  </v-layout>
                </v-form>
              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-btn color="blue darken-1" flat @click.native="paymentDialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click.native="pay()" :disabled=validPayent>Pay</v-btn>
            </v-card-actions>
            <v-data-table :headers="paymentHeaders" :items="order.paymentDetails" item-key="name" class="elevation-1">
              <template slot="items" slot-scope="props"> 
                <td>{{ formateDate(props.item.payment_date) }}</td>              
                <td>{{ formateTime(props.item.payment_date) }}</td>
                <td>{{ props.item.amount }}</td>
                <td>{{ props.item.mode }}</td>
              </template>
            </v-data-table>

          </v-card>
        </v-dialog>

        <div style="display:none">
        <div id="printArea">
          <div class="recipt" id="recipt">

            <table class="header" style="width:100%">
              <thead>
                <tr>
                  <td colspan="4"> LORENZ & SON</td>
                </tr>
                <tr>
                  <td colspan="4"> BEHIND MUNCIPAL BLDG</td>
                </tr>
                <tr>
                  <td colspan="4"> MARGAO - 40601 GOA PH:732892</td>
                </tr>
                <tr>
                  <td colspan="4" style="border-top: 1px solid;"></td>
                </tr>
              </thead>
              <tr><td colspan="4"><span v-if="order.status== 'delivered'"> Invoice Copy</span><span v-else>Job Order</span></td></tr>
              <tr><td colspan="4" style="border-top: 1px solid;"></td></tr>
              <tr style="font-size:13px">
                <td>Order No</td>
                <td> {{order.order_no}}</td>
                <td>O. Date</td>
                <td>{{formateDate(order.order_date)}}</td>
              </tr>
              <tr style="font-size:13px">
                <td>Cust.Name</td>
                <td>{{order.customer_name}}</td>
                <td><span v-if="order.status== 'delivered'"> Delivered D.</span><span v-else>Delivery D.</span></td>
                 <td>{{formatedDeliveryDate}}</td>
              </tr>
             <tr><td colspan="4" style="border-top: 1px solid;"></td></tr>
            </table>         
            <table vlaign= "top" style="width:100%">
              <thead>
                <tr>
                  <td> Sr </td>
                  <td>Product</td>
                  <td> Qty </td>
                  <td> Amount</td>
                </tr>
              </thead>
              <tbody>
                <td colspan="100" style="border-top: 1px solid;"></td>
                <tr v-for="(order, index) in order.orderDetails" :key="index">
                  <td valign="top" >{{index + 1}}</td>
                  <td valign="top" ><span >{{order.productName}}</span> <span  v-if="order.hasSize">({{order.size.height}} *  {{order.size.width}})</span></td>
                  <td valign="top" >{{order.qty}}</td>
                  <td valign="top" >{{order.amt}}</td>
                </tr>
                <td colspan="4" style="border-top: 1px solid;"></td>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" style="top-border:1px solid"></td>
                </tr>

                <tr>
                  <td colspan="3">Items</td>
                  <td colspan="1">{{order.items }}</td>
                </tr>
                <tr>
                  <td colspan="3">Amount</td>
                  <td colspan="1">{{ order.total }}</td>
                </tr>
                 <tr v-if="order.discount_amt > 0 ">
                  <td colspan="3">
                    Discount
                  </td>
                  <td>{{ order.discount_amt }}</td>
                </tr>
                <tr>
                  <td colspan="3">
                    Tax({{order.tax}} % )
                  </td>
                  <td>{{ order.taxAmt }}</td>
                </tr>
                <tr>
                  <td colspan="3"><strong>Total Amount</strong></td>
                  <td class="text-xs-right">{{ order.grand_total }}</td>
                </tr>
                <tr>
                  <td colspan="3"><strong>Paid Amount</strong></td>
                  <td class="text-xs-right">{{ order.paid_amount }}</td>
                </tr>
                <tr>

                  <td colspan="3" class="text-xs-right"><strong>Rounding Off</strong></td>
                  <td class="text-xs-right">{{ order.roundOff }}</td>

                </tr>
                <tr>

                  <td colspan="3"><strong>Payable Amount</strong></td>
                  <td class="text-xs-right">{{ order.net_payable }}</td>
                </tr>
                <td colspan="8" style="border-top: 1px solid;"></td>

              </tfoot>
            </table>
            <small>Prepared By : {{order.created_user}}</small>
            
          </div>
        </div>
        </div>





        <v-btn color="indigo" fab dark absolute top left @click.native="addOrder()">
          <v-icon dark>group_add</v-icon>
        </v-btn>


        <v-card-title>
          <span class="heading">Order</span>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :search="search" :items="orderList" item-key="name" :rows-per-page-items="pageSetup"
          :loading="orderLoading" class="elevation-1 order-table">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.order_no }}</td>
            <td>{{ props.item.customer_name }}</td>
            <td>{{ props.item.grand_total }}</td>
            <td>{{ formateDate(props.item.order_date) }}</td>
            <td>{{ formateDate(props.item.delivery_date) }}</td>
            <td>
              <v-chip color="primary" text-color="white">{{ props.item.status }}</v-chip>
            </td>
            <td class="text-xs-center">
              <v-btn v-on:click="editOrder(props.item)" v-if="role =='admin'" outline small fab color="white">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn v-on:click="viewOrder(props.item)" outline small fab color="white">
                <v-icon>visibility</v-icon>
              </v-btn>
              <v-btn v-on:click="confirmDeleteOrder(props.item)" v-if="role =='admin'" outline small fab color="white">
                <v-icon>remove</v-icon>
              </v-btn>

            </td>
          </template>
        </v-data-table>

        <v-dialog dark v-model="deleteDialog" max-width="330">
          <v-card>
            <v-card-title class="headline">Delete Order</v-card-title>

            <v-card-text>
              Are you sure you want to delete this Order ?
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" flat="flat" @click="deleteDialog = false">
                No
              </v-btn>

              <v-btn color="green darken-1" flat="flat" @click="deleteOrder()">
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <!--  progress bar !-->
        <v-dialog v-model="processing" hide-overlay persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Please wait
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>

          <v-dialog v-model="orderInfo" max-width="290">
            <v-card>
              <v-card-title class="headline">Order No </v-card-title>
                <v-card-text>
                <h1 style=" font-size: 140px;">{{order.order_no}}</h1>
                </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat="flat" @click="orderInfo = false">
                  close
                </v-btn>
              </v-card-actions>
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
  import moment from 'moment'
  import DateOnly from 'dateonly'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  export default {
    data() {
      return {
        validated: 1,
        addNew:false,
        search: '',
        validPay: true,
        valid: true,
        orderInfo:false,
        snackbar: false,
        snackbarMessage: "",
        snackbarColor: "green",
        processing: false,
        formatedDeliveryDate: moment().format('DD-MM-YYYY'),
        payment: {
          amount: 0,
          mode: 'Cash'
        },
        dateFormatted:'',
        pageSetup: [20, 30, 40, {
          "text": "$vuetify.dataIterator.rowsPerPageAll",
          "value": -1
        }],
        createOrderDialog: false,
        loginPage: false,
        employe: {},
        productList: [],
        needSetup: true,
        orderList: [],
        orderLoading: true,
        view: false,
        deleteDialog: false,
        role: this.$cookie.get('role'),
        paymentDialog: false,
        paymentEnabled: true,
        paymentDisabled: false,
        setDeleteOrder: {},
        pagination: {
          sortBy: 'order_no',
          descending: false,
        },
        productMap: [],
        printDialog: false,
        statusItem: [{
          text: 'pending',
          disabled: false
        }, {
          text: 'ready',
          disabled: true
        }, {
          text: 'delivered',
          disabled: true
        }],
        paymentType: ['Cash', 'Card', 'Cheque'],
        paymentHeaders: [ 
          {
            text: 'Date',
            align: 'center',
            value: 'payment_date',
            sortable: false,
          },
            {
            text: 'Time',
            align: 'center',
            value: 'payment_date',
            sortable: false,
          },
          {
            text: 'Amount',
            align: 'center',
            value: 'amout',
            sortable: false,
          },
           {
            text: 'Mode',
            align: 'center',
            value: 'Mode',
            sortable: false,
          }




        ],
        headers: [{
            text: 'Order No',
            align: 'center',
            value: 'order_no',
            sortable: false,
          },
          {
            text: 'Customer Name',
            align: 'center',
            value: 'name'
          },
          {
            text: 'Grand Total',
            align: 'center',
            value: 'grand_total'
          },
          {
            text: 'Order Date',
            align: 'center',
            value: 'order_date'
          },
          {
            text: 'Deleivery Date',
            align: 'center',
            value: 'deleiver_date'
          },
          {
            text: 'Status',
            align: 'center',
            value: 'status'
          },
          {
            text: 'Action',
            align: 'center',
            value: 'action'
          }
        ],
        order: {
          total: 0,
          taxAmt: 0,
          tax: 0,
          paid_amount: 0,
          status: 'pending',
          paymentDetails: [],
          grand_total: 0,
          discount:0,
          discount_amt:0,
          items:0,
          orderDetails: [{
            product_id: '',
            qty: 1,
            size: {},
            price: 0,
            index: 0
          }],
        },

        rules: {
          required: value => !!value || 'Required.',
          validateNum: value => !isNaN(value) || 'Number Required.',
          counter: value => value.length <= 20 || 'Max 20 characters',
          checkAmount: value => (-1 < parseInt(this.order.balance)) || 'more then balance',
          checkDiscount: value => (-1 < parseInt(this.order.net_payable)) || 'Cannot provide more discount',
          email: value => {
            const pattern =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        },
        numberRule: [(value) => !isNaN(num1) || 'number is required'],

        menu: false,
        orderDetailHeader: [{
            text: 'Product',
            value: 'product',
            sortable: false,
          },
          {
            text: 'Size ',
            value: 'size',
            sortable: false,
          },
          {
            text: 'Rate',
            sortable: false,
            value: 'rate'
          },
          {
            text: 'Price',
            sortable: false,
            value: 'price'
          },
          {
            text: 'Qty',
            sortable: false,
            value: 'qty'
          },
          {
            text: 'Amount',
            sortable: false,
            value: 'amount'
          },
          {
            text: 'Remove',
            sortable: false,
            value: 'Remove'
          }


        ],
      }
    },
    mounted() {
      this.getAllProduct();
      this.getAllOrder();     
    },
    computed: {
      // a computed getter
      payeble: function () {
        return this.order.grand_total - this.order.paid_amount;
      },
      validPayent: function () {
        return this.paymentDisabled || !this.validPay || this.payment.amount <= 0
      },
      isStatusReadOnly: function () {
        return this.view && this.order.status == "delivered" || this.addNew && this.order.status == "delivered"
      }
    },
    watch: {
      "order.grand_total": function (value) {
        var netPay = this.order.grand_total - parseFloat(this.order.paid_amount);
        this.order.net_payable = Math.round(netPay);
        this.order.roundOff = this.roundToTwo(this.order.net_payable - netPay);
      },
       "createOrderDialog": function (value){
        this.calculateTotalItem();
           
      },
      "order.paid_amount": function (value) {
        const netPay = this.order.grand_total - this.order.paid_amount;
        this.order.net_payable = Math.round(netPay);
        this.order.roundOff = this.roundToTwo(this.order.net_payable - netPay);
      },
      "order.delivery_date": function (value) {
          this.formatedDeliveryDate = this.formatStringDate(value);
      }

    },
    methods: {
      reset() {
        this.$refs.form.reset();
      },
      saveDate(date) {
        this.$refs.menu.save(date);
        console.log(this.$refs.status);
        this.$refs.status.focus();

      },

      setDefaut() {
        this.order = {
          total: 0,
          taxAmt: 0,
          tax: 0,
          discount:0,
          discount_amt:0,
          test:0,
          paid_amount: 0,
          status: 'pending',
          delivery_date: new Date().toISOString().substr(0, 10),          
          paymentDetails: [],
          grand_total: 0,
          orderDetails: [{
            product_id: '',
            hasSize: false,
            qty: 1,
            size: {},
            price: 0,
            index: 0
          }],
        };
      },

      addOrder() {
        this.setDefaut();
        this.createOrderDialog = true;
        this.statusItem[1].disabled = true;
        this.view = false;
        this.addNew = true;
        var self = this;
        setTimeout(function () {
          self.$refs.customer_name.focus();
        }, 1);
      },

      save() {
        console.log(this.$refs.form);
   
        if (this.$refs.form.validate()) {
          this.processing = true;
          this.order.created_user = this.$cookie.get('username');
          Axios.post(`${apiURL}/api/v1/order`, {
              order: this.order
            })
            .then(({
              data
            }) => {
              console.log(data)
              this.order = data.data;
              this.order.delivery_date = this.order.delivery_date ? moment(new DateOnly(this.order.delivery_date)).format(
                'DD-MM-YYYY') : "";
              this.calculateBalance();
              this.getAllOrder();
              this.processing = false;
              this.snackbarMessage = "Order Succesfuly Created";
              this.snackbarColor = "green";
              this.snackbar = true;
              this.calculatePaidAmt();
              this.calculateBalance();
              this.calculateTotalItem();
           
              this.statusItem[1].disabled = false;
              this.view = true;
              this.orderInfo=true;
              ///
              const netPay = this.order.grand_total - this.order.paid_amount;
              this.order.net_payable = Math.round(netPay);
              this.order.roundOff = this.roundToTwo(this.order.net_payable - netPay);

            }).catch(({
              response: {
                data
              }
            }) => {})
        }
      },


      calculateTotalItem(){
      console.log("test 1111")
      var totalItem = 0;
      console.log(this.order.orderDetails)
      this.order.orderDetails.forEach(element => {
        totalItem =totalItem + 1;       
      });
        this.order.items = totalItem;
      },

      setup() {
        this.order.created_user = this.$cookie.get('username');
        Axios.post(`${apiURL}/api/v1/setup/ordercounter`, {
            order: this.order
          })
          .then(({
            data: {
              token
            }
          }) => {

          }).catch(({
            response: {
              data
            }
          }) => {})
      },


      activeProduct(item) {
        console.log("test", item.productId);
        if (item.productId) {
          const product = this.productList.find(function (product) {
            return product._id == item.productId
          });
          item.hasSize = product.hasSize ? product.hasSize : false;
          this.$set(item, 'size', {});
          item.productName = product.name,
            item.size.height = product.hasSize ? product.size.height : '';
          item.size.width = product.hasSize ? product.size.width : '';
          item.rate = product.hasSize ? product.size.rate : '';
          item.price = product.price;
          item.amt = parseFloat(item.qty) * parseFloat(item.price);
          this.calculateTotal();
        }
      },
      addItem() {
        this.order.orderDetails.push({
          product_id: '',
          qty: 1,
          size: {},
          price: 0,
        });
      },

      removeItem(index) {
        this.order.orderDetails.splice(index, 1);
        this.calculateTotal();
      },

      calculateAmount(item) {
        console.log({
          item
        })
        if (item.hasSize) {
          const rate = parseFloat(item.rate);
          item.price = this.roundToTwo(parseFloat(item.size.height) * parseFloat(item.size.width) * rate);
          console.log(item, rate);
        }
        item.amt = parseFloat(item.qty) * parseFloat(item.price);
        console.log(this.order.orderDetails);
        this.calculateTotal();
      },

      calculateTotal() {
        let total = 0;
        let totalItem =0;
        this.order.orderDetails.forEach(element => {
          totalItem =totalItem + 1;
          total = element.amt ? total + element.amt : total;
        });
        this.order.items= totalItem;
        this.order.total = total;
        this.calculateTax();
      },

      calculateTax() {              
        this.order.taxAmt = this.roundToTwo((this.order.tax * (this.order.total - this.order.discount_amt)) / 100);
        this.order.grand_total = this.roundToTwo(this.order.total - this.order.discount_amt + this.order.taxAmt);
      },
      calculateDiscount(value){       
       this.calculateTax();
      },

      discountedAmt() {
        return this.roundToTwo(this.order.total - this.order.discount_amt);
      },

      getAllOrder(context) {
        this.orderLoading = true,
          Axios.get(`${apiURL}/api/v1/order`, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            }
          }).then(({
            data
          }) => (
            this.orderList = data,
            this.needSetup = data.length > 0 ? false : true,
            this.orderLoading = false,
            console.log(data)
          ))
      },

      getAllProduct(context) {
        Axios.get(`${apiURL}/api/v1/product`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.productList = data,
          this.productList.map(product => {
            product.customName = product.name + '(' + product.code + ')';
            return product;
          }),
          this.productLoading = false,
          data.forEach((product) => {
            this.productMap[product._id] = product
          }),
          console.log(data)
        ))
      },

      update(context) {
        if (this.$refs.form.validate()) {
          this.processing = true;
          Axios.put(`${apiURL}/api/v1/order`, {
            order: this.order
          }, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            }
          }).then(({
            data
          }) => {
            console.log(data);
            this.order = data;
            this.order.delivery_date = this.order.delivery_date ? moment(new DateOnly(this.order.delivery_date)).format(
              'YYYY-MM-DD') : "";
            this.calculateBalance();
            this.getAllOrder();
            this.processing = false;
            this.snackbarMessage = "Order Succesfuly Updated";
            this.snackbarColor = "green";
            this.snackbar = true;
            this.calculatePaidAmt();
            this.calculateBalance();
            this.calculateTotalItem();
           
            this.statusItem[1].disabled = false;
            this.view = false;
            /////
            const netPay = this.order.grand_total - this.order.paid_amount;
            this.order.net_payable = Math.round(netPay);
            this.order.roundOff = this.roundToTwo(this.order.net_payable - netPay);
          })
        }
      },

      confirmDeleteOrder(order) {
        this.setDeleteOrder = order._id;
        this.deleteDialog = true;
      },

      deleteOrder() {
        Axios.put(`${apiURL}/api/v1/order/delete`, {
          _id: this.setDeleteOrder
        }, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (console.log(data), this.deleteDialog = false, this.getAllOrder()))
      },

      formateDate(date) {
        return date ? moment(new DateOnly(date)).format('DD-MM-YYYY') : "";
      },



      editOrder(order) {
        this.createOrderDialog = true;
        this.order = JSON.parse(JSON.stringify(order));         
        this.order.discount_amt = this.order.discount_amt ? this.order.discount_amt :0;
        this.order.delivery_date = this.order.delivery_date ? moment(new DateOnly(this.order.delivery_date)).format(
          'YYYY-MM-DD') : "";
        this.formatedDeliveryDate = this.formatStringDate(this.order.delivery_date);  
        this.calculatePaidAmt();
        this.calculateBalance();
        this.statusItem[1].disabled = false;
        this.view = false;
        this.addNew = false;
        /////
        const netPay = this.order.grand_total - this.order.paid_amount;
        this.order.net_payable = Math.round(netPay);
        this.order.roundOff = this.roundToTwo(this.order.net_payable - netPay);
      },

      viewOrder(order) {
        this.order= {};
        this.createOrderDialog = true;        
        console.log({order});
        this.order = JSON.parse(JSON.stringify(order));
        this.order.discount_amt = this.order.discount_amt ? this.order.discount_amt :0;  
        this.order.delivery_date = this.order.delivery_date ? moment(new DateOnly(this.order.delivery_date)).format(
          'YYYY-MM-DD') : "";
        this.formatedDeliveryDate = this.formatStringDate(this.order.delivery_date);
        this.calculatePaidAmt();
        this.calculateBalance();
        this.statusItem[1].disabled = false;
        this.view = true;      
      },

      pay() {
        const orderDate  = this.order.order_date ? moment(new DateOnly(this.order.order_date)).format('YYYY-MM-DD') : new Date().toISOString().substr(0, 10);
        this.calculatePaidAmt(); 
        console.log(this.order);       
        const balance =this.getBalance();
        var check = balance == 0 && this.order.status =='ready'? true : false;
        var check2 = balance != 0 ? true : false;
        var check3 =  this.order.delivery_date == orderDate ?true: false;
        console.log('check1 '+ (this.order.paymentDetails.length == 0 && (check || check2 || check3)));
         console.log(((this.order.paymentDetails.length > 0) && (this.order.status =='ready' && balance == 0)));
        if ((this.order.paymentDetails.length == 0 && (check || check2 || check3)) || ((this.order.paymentDetails.length > 0) && (this.order.status =='ready' && balance == 0))) {
                this.order.paymentDetails.push(this.payment);
                this.payment = {
                  amount: 0,
                  mode: 'Cash'
                };
                this.calculatePaidAmt(); 
                this.order.net_payable = this.order.net_payable - this.order.paid_amount;
                this.calculateBalance();
                console.log(this.order.balance);
                if (this.order.balance == 0) {
                  this.order.status = "delivered";
                  this.order.delivery_date = new Date().toISOString().substr(0, 10);
                }
                this.saveOrUpdate();

        } else {
          this.snackbarMessage = "Order should be in Ready State";
          this.snackbarColor = "red";
          this.snackbar = true;
        }
      },

      saveOrUpdate() {
        if (this.order._id) {
          this.update();
        } else {
          this.save();
        }
        this.paymentDialog = false;
        this.checkFinalPayment();
      },
      roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
      },
      calculatePaidAmt() {
        let count = 0;
        console.log(this.order.paymentDetails)
        if (this.order.paymentDetails) {
          this.order.paymentDetails.forEach((element) => {
            count = count + (parseFloat(element.amount) || 0);
            console.log({
              count
            });
          });
        }
        console.log(count);
        this.order.paid_amount = count;
      },

      calculateBalance() {

        this.order.balance = (this.order.grand_total + (parseFloat(this.order.roundOff) || 0)) - ((parseFloat(this.order
          .paid_amount) || 0) + (parseFloat(this.payment
          .amount) || 0));
        console.log(parseFloat(this.order.paid_amount) + "+" + parseFloat(this.payment.amount));
      },

      getBalance(){
        return (this.order.grand_total + (parseFloat(this.order.roundOff) || 0)) - ((parseFloat(this.order.paid_amount) || 0) + (parseFloat(this.payment.amount) || 0));
      },

      checkFinalPayment() {
        if (this.order.paymentDetails.length > 0) {
          this.paymentEnabled = false;
          this.payment.amount = this.order.balance;
        } else {
          this.paymentEnabled = true;
          this.payment.amount = 0;
        }
        if (this.order.balance <= 0) {
          this.paymentDisabled = true;
        } else {
          this.paymentDisabled = false;
        }
      },

      formateTime(date) {
        return date ? moment(date).format('hh:mm A') : "";
      },
      formatStringDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },

      printElem() {
        var content = document.getElementById('printArea').innerHTML;
        var mywindow = window.open('', 'Print', 'height=600,width=800');

        mywindow.document.write(
          '<html><head><title>Print</title><style>.recipt{width:80mm;}.recipt .header td{text-align:center} .trim{display: inline-block;max-width: 80px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;} .position{ position:relative;top:-4}</style>'
        );
        mywindow.document.write('</head><body >');
        mywindow.document.write(content);
        mywindow.document.write('</body></html>');

        mywindow.document.close();
        mywindow.focus()
        mywindow.print();
        mywindow.close();
        return true;
      }

    }
  }

</script>
<style>
  .order_no {
    font-size: 40px !important;
    font-weight: bold;
    color: white;
  }

  .order_no input {
    color: white !important;
  }


  .order table.v-table tfoot tr {
    height: 9px;
    border-top: none;
  }

  .order tfoot {
    border-top: 1px solid;
  }

  .order .v-input input {
    max-height: 27px;
  }

  .order .input__control {
    height: 25px;
  }

  .recipt {
    width: 80mm;
    border: 1px solid;
  }

  .order-table .v-btn--floating.v-btn--small {
    height: 32px !important;
    width: 32px !important;
  }
  .trim{
    display: inline-block;
    max-width: 80px;    
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  @media print {

    /* styles go here */
    .application--wrap {
      display: none;
    }

    .toolbar__content {
      display: none;

    }

    .recipt {
      width: 80mm;
      border: 3px solid red;
    }

  }

</style>
