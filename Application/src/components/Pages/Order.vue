<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <v-container>

        <v-dialog v-model="createOrderDialog" fullscreen transition="dialog-bottom-transition" :overlay="false"
          scrollable>
          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="createOrderDialog = false" dark>
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
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Order No" v-model="order.order_no" disabled ></v-text-field>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Customer Name " required v-model="order.customer_name"  :rules="[rules.required]" :readonly="view"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Customer Phone No " required v-model="order.customer_tel"  :rules="[rules.required]"  :readonly="view"></v-text-field>
                    </v-flex>
                    <v-flex xs9 sm6 md3>
                      <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition"
                        offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="order.delivery_date">
                        <v-text-field slot="activator" label="Date Of Delivery"  v-model="order.delivery_date" required
                          prepend-icon="event" readonly></v-text-field>
                        <v-date-picker required :rules="[rules.required]"   v-model="order.delivery_date" @change="saveDate" no-title scrollable>
                        </v-date-picker>
                      </v-menu>

                    </v-flex>


                    <v-flex xs12 sm6 md3>
                      <v-select :items="statusItem" required :readonly="view" label="Status" v-model="order.status" :rules="[rules.required]" ></v-select>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <v-data-table hide-actions :headers="orderDetailHeader" :items="order.orderDetails" item-key="name"
                        class="elevation-1 order">
                        <template slot="items" slot-scope="props">
                          <td>
                            <v-select  required :items="productList"  :rules="[rules.required]"  v-model="props.item.productId" item-value="_id" item-text="name"
                              autocomplete single-line @input="activeProduct(props.item) " :readonly="view"></v-select>
                          </td>
                          <td>
                            <div v-if="props.item.hasSize" calss="xs4 sm4 md6" style="display:inline-flex;max-width:200px">
                              <v-flex xs4 sm4 md6>
                                <v-text-field v-model="props.item.size.height" @input="calculateAmount(props.item)"
                                  :rules="[rules.required]" :readonly="view"></v-text-field>
                              </v-flex>
                              <v-flex xs4 sm4 md6>
                                <v-text-field v-model="props.item.size.width" @input="calculateAmount(props.item)"
                                  :rules="[rules.required, rules.validateNum]" :readonly="view"></v-text-field>
                              </v-flex>
                            </div>

                          </td>

                          <td>
                            <v-text-field v-if="props.item.hasSize" :readonly="view" v-model="props.item.rate" @input="calculateAmount(props.item)"></v-text-field>
                          </td>
                          <td class="text-xs-center">
                            <v-text-field v-model="props.item.price" :readonly="view" type="number" @input="calculateAmount(props.item)"></v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="props.item.qty" :readonly="view" type="number" @input="calculateAmount(props.item)"></v-text-field>
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
                              <v-btn fab  :disabled="view" color="indigo" dark small top @click.native="addItem()">
                                <v-icon dark>add</v-icon>
                              </v-btn>
                            </td>
                            <td colspan="4" class="text-xs-right"><strong>Amount</strong></td>
                            <td colspan="1" class="text-xs-right">{{ order.total }}</td>
                          </tr>
                          <tr>
                            <td colspan="4" class="text-xs-right"><strong>Tax</strong></td>
                            <td class="text-xs-right">
                              <v-text-field v-model="order.tax" @input="calculateTax()" :readonly="view" type="number"></v-text-field>
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
                            <td>
                              <v-btn color="indigo"  :disabled="!valid" indigo dark small @click.native="paymentDialog = true,calculateBalance()">
                                Payement
                              </v-btn>
                            </td>
                            <td colspan="4" class="text-xs-right"><strong>Payeble Amount</strong></td>
                            <td class="text-xs-right">{{ payeble }}</td>
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
                <v-layout wrap>
                 
				  <v-flex xs12 sm12 md6>
                    <v-text-field label="Amount*" v-model="payment.amount" required @input="calculateBalance()" :rules="[rules.validateNum]"></v-text-field>
                  </v-flex>
				   <v-flex xs12 sm12 md6>
                    <v-text-field label="Amount Paid "  disabled v-model="order.paid_amount" required @input="calculateBalance()" :rules="[rules.validateNum]"></v-text-field>
                  </v-flex>				
				  
				   <v-flex xs12 sm6 md6>
                    <v-select :items="paymentType" label="Payment Mode" v-model="payment.mode"></v-select>
                  </v-flex>
				  
                  <v-flex xs12 sm12 md6>
                    <v-text-field label="Balance*" disabled v-model="order.balance" required></v-text-field>
                  </v-flex>
                 
                </v-layout>
              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-btn color="blue darken-1" flat @click.native="paymentDialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click.native="pay()">Pay</v-btn>
            </v-card-actions>
            <v-data-table :headers="paymentHeaders" :items="order.paymentDetails" item-key="name" class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>{{ props.item._id }}</td>
                <td>{{ formateDate(props.item.payment_date) }}</td>
                <td>{{ props.item.amount }}</td>
              </template>
            </v-data-table>

          </v-card>
        </v-dialog>

        <v-dialog v-model="printDialog" fullscreen transition="dialog-bottom-transition" :overlay="false" scrollable>

          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="printDialog = false" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>print</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat v-if="!order._id" @click.native="print()">Print</v-btn>
              </v-toolbar-items>
            </v-toolbar>



            <v-card-text>
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
                    <tr>
                      <td>Order No</td>
                      <td> {{order.order_no}}</td>
                      <td>Date</td>
                      <td>{{formateDate(order.order_date)}}</td>
                    </tr>
                    <tr>
                      <td>Customer Name</td>
                      <td>{{order.customer_name}}</td>
					   <td></td>
                      <td></td>
                    </tr>
					<td colspan="4" style="border-top: 1px solid;"></td>
                  </table>
                  </hr>
                  <table style="width:100%">
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
                        <td>{{index + 1}}</td>
                        <td><span v-if="productMap[order.productId]">{{productMap[order.productId].name}}</span></span></td>
                        <td>{{order.qty}}</td>
                        <td>{{order.amt}}</td>
                      </tr>
					 <td colspan="4" style="border-top: 1px solid;"></td>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="4" style="top-border:1px solid"></td>
                      </tr>
                      <tr>
                        <td colspan="3">Amount</td>
                        <td colspan="1">{{ order.total }}</td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          Tax
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

                        <td colspan="3"><strong>Payable Amount</strong></td>
                        <td class="text-xs-right">{{ payeble }}</td>
                      </tr>
					  <td colspan="8" style="border-top: 1px solid;"></td>

                    </tfoot>
                  </table>
				<small>Prepared By : {{order.created_user}}</small>
                </div>
              </div>
</hr>
              <small>*indicates required field</small>

            </v-card-text>

          </v-card>

        </v-dialog>





        <v-btn color="indigo" fab dark absolute top left @click.native="addOrder()">
          <v-icon dark>group_add</v-icon>
        </v-btn>




        <v-card-title>
          Order
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :search="search" :items="orderList" item-key="name" :loading="orderLoading"
          class="elevation-1">
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
              <v-btn v-on:click="editOrder(props.item)" v-if="role =='admin'" outline small fab color="indigo">
                <v-icon>edit</v-icon>
              </v-btn>

              <v-btn v-on:click="viewOrder(props.item)" outline small fab color="indigo">
                <v-icon>visibility</v-icon>
              </v-btn>

            </td>
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
  import moment from 'moment'
  import DateOnly from 'dateonly'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  export default {
    data() {
      return {
        validated: 1,
        search: '',
		valid:true,
        payment: {
		amount: 0,
		mode:'Cash'
		},
        createOrderDialog: false,
        loginPage: false,
        employe: {},
        productList: [],
        needSetup: true,
        orderList: [],
        orderLoading: true,
        view: false,
		role: this.$cookie.get('role'),
        paymentDialog: false,
        pagination: {
          sortBy: 'order_no',
          descending: false,
        },
        productMap: [],
        printDialog: false,
        statusItem: ['pending', 'ready', 'delivered'],
        paymentType: ['Cash', 'Card', 'Cheque'],
        paymentHeaders: [{
            text: 'Transation Id',
            align: 'center',
            value: '_id',
            sortable: false,
          },
          {
            text: 'Date',
            align: 'center',
            value: 'payment_date',
            sortable: false,
          },
          {
            text: 'Amount',
            align: 'center',
            value: 'amout',
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
            value: 'product'
          },
          {
            text: 'Size ',
            value: 'size'
          },
          {
            text: 'Rate',
            value: 'rate'
          },
          {
            text: 'Price',
            value: 'price'
          },
          {
            text: 'Qty',
            value: 'qty'
          },
          {
            text: 'Amount',
            value: 'amount'
          },
          {
            text: 'Remove',
            value: 'Remove'
          }


        ],
      }
    },
    mounted() {
      this.getAllProduct();
      this.getAllOrder()
    },
    computed: {
      // a computed getter
      payeble: function () {
        return this.order.grand_total - this.order.paid_amount;
      }
    },
    methods: {
      saveDate(date) {
        this.$refs.menu.save(date)
      },


      addOrder() {
        this.order = {
          total: 0,
          taxAmt: 0,
          tax: 0,
          paid_amount: 0,
          status: 'pending',
          paymentDetails: [],
          grand_total: 0,
          orderDetails: [{
            product_id: '',
            qty: 1,
            size: {},
            price: 0,
            index: 0
          }],
        };
        this.createOrderDialog = true;

      },

      save() {
	  console.log(this.$refs.form);
	   if (this.$refs.form.validate()) {
        this.order.created_user = this.$cookie.get('username');
        Axios.post(`${apiURL}/api/v1/order`, {
            order: this.order
          })
          .then(({
            data
          }) => {
            console.log(data)
            this.order = data.data;
			this.calculateBalance();
            this.getAllOrder();

          }).catch(({
            response: {
              data
            }
          }) => {})
      }},

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
        console.log(item.productId);
        const product = this.productList.find(function (product) {
          return product._id == item.productId
        });
        item.hasSize = product.hasSize ? product.hasSize : false;
        this.$set(item, 'size', {});
        item.size.height = product.hasSize ? product.size.height : '';
        item.size.width = product.hasSize ? product.size.width : '';
        item.rate = product.hasSize ? product.size.rate : '';
        item.price = product.price;
        item.amt = parseFloat(item.qty) * parseFloat(item.price);
        this.calculateTotal();
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
          item.price = parseFloat(item.size.height) * parseFloat(item.size.width) * rate;
          console.log(item, rate);
        }
        item.amt = parseFloat(item.qty) * parseFloat(item.price);
        console.log(this.order.orderDetails);
        this.calculateTotal();
      },

      calculateTotal() {
        let total = 0;
        this.order.orderDetails.forEach(element => {
          total = element.amt ? total + element.amt : total;
        });
        this.order.total = total;
        this.calculateTax();
      },

      calculateTax() {
        this.order.taxAmt = (this.order.tax * this.order.total) / 100;
        this.order.grand_total = this.order.total + this.order.taxAmt;
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
          this.productLoading = false,
          data.forEach((product) => {
            this.productMap[product._id] = product
          }),
          console.log(data)
        ))
      },

      update(context) {
	   if (this.$refs.form.validate()) {
        Axios.put(`${apiURL}/api/v1/order`, {
          order: this.order
        }, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (console.log(data), this.order= data,this.calculateBalance(), this.getAllOrder()))
		}
      },


      formateDate(date) {
        return date ? moment(new DateOnly(date)).format('YYYY-MM-DD') : "";
      },



      editOrder(order) {
        this.createOrderDialog = true;
        this.order = order;
        this.order.delivery_date = this.order.delivery_date ? moment(new DateOnly(this.order.delivery_date)).format(
          'YYYY-MM-DD') : "";
        this.calculatePaidAmt();
        this.calculateBalance();
        this.view = false;
      },

      viewOrder(order) {
        this.createOrderDialog = true;
        this.order = order;
        this.order.delivery_date = this.order.delivery_date ? moment(new DateOnly(this.order.delivery_date)).format(
          'YYYY-MM-DD') : "";
        this.calculatePaidAmt();
        this.calculateBalance();
        this.view = true;
      },

      pay() {
        this.order.paymentDetails.push(this.payment);
        this.payment = {
		amount: 0,
		mode:'Cash'
		}
        this.calculatePaidAmt();
		this.saveOrUpdate();
      },
	  
       saveOrUpdate(){
		if(this.order._id){
		this.update();
		}else{
		this.save();
		}},
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
        console.log(this.order);
        this.order.balance = this.order.grand_total - ((parseFloat(this.order.paid_amount) || 0) + (parseFloat(this.payment
          .amount) || 0));
        console.log(parseFloat(this.order.paid_amount) + parseFloat(this.payment.amount));
      },
      printElem() {
        var content = document.getElementById('printArea').innerHTML;
        var mywindow = window.open('', 'Print', 'height=600,width=800');

        mywindow.document.write(
          '<html><head><title>Print</title><style>.recipt{width:80mm;}.recipt .header td{text-align:center}</style>'
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
  .order table.v-table tfoot tr {
    height: 9px;
    border-top: none;
  }

  .order tfoot {
    border-top: 1px solid;
  }

  .order .v-input input {
    max-height: 1px;
  }

  .order .input__control {
    height: 25px;
  }

  .recipt {
    width: 80mm;
    border: 1px solid;
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
