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
                <v-btn dark flat v-if="!employe._id" @click.native="save()">Save</v-btn>
                <v-btn dark flat v-if="employe._id" @click.native="update()">Update</v-btn>
              </v-toolbar-items>
            </v-toolbar>



            <v-card-text>

              <v-container grid-list-md>
                <v-form ref="form">
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Customer Name " v-model="order.customer_name"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Customer Phone No " v-model="order.customer_tel"></v-text-field>
                    </v-flex>
                    <v-flex xs9 sm6 md3>
                      <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition"
                        offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="order.dateOfSale">
                        <v-text-field slot="activator" label="Date Of Delivery" v-model="order.dateOfSale" required
                          prepend-icon="event" readonly></v-text-field>
                        <v-date-picker v-model="order.dateOfSale" @change="saveDate" no-title scrollable>
                        </v-date-picker>
                      </v-menu>

                    </v-flex>

                    <v-btn fab dark small @click.native="addItem()">
                      <v-icon dark>add</v-icon>
                    </v-btn>

                    <v-flex xs12 sm12 md12>
                      <v-data-table hide-actions :headers="orderDetailHeader" :items="order.orderDetails" item-key="name"
                        class="elevation-1">
                        <template slot="items" slot-scope="props">
                          <td>
                            <v-select :items="productList" v-model="props.item.productId" item-value="_id" item-text="name"
                              autocomplete single-line @input="activeProduct(props.item) "></v-select>
                          </td>
                          <td>
                            <div v-if="props.item.hasSize" calss="xs4 sm4 md6" style="display:inline-flex;max-width:200px">
                              <v-flex xs4 sm4 md6>
                                <v-text-field v-model="props.item.size.height" @input="calculateAmount(props.item)"
                                  :rules="[rules.required]"></v-text-field>
                              </v-flex>
                              <v-flex xs4 sm4 md6>
                                <v-text-field v-model="props.item.size.width" @input="calculateAmount(props.item)"
                                  :rules="[rules.required]"></v-text-field>
                              </v-flex>
                            </div>

                          </td>

                          <td>
                            <v-text-field v-if="props.item.hasSize" v-model="props.item.rate" @input="calculateAmount(props.item)"></v-text-field>
                          </td>
                          <td class="text-xs-center">
                            <v-text-field v-model="props.item.price" @input="calculateAmount(props.item)"></v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="props.item.qty" @input="calculateAmount(props.item)"></v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="props.item.amt"></v-text-field>
                          </td>
                          <td>
                            <v-btn fab dark small @click.native="removeItem(props.index)">
                              <v-icon dark>delete</v-icon>
                            </v-btn>
                          </td>
                        </template>
                        <template slot="footer">
                          <tr>
                            <td colspan="5" class="text-xs-right"><strong>Amount</strong></td>
                            <td colspan="1" class="text-xs-right">{{ order.total }}</td>
                          </tr>
                          <tr>
                            <td colspan="4" class="text-xs-right"><strong>Tax</strong></td>
                            <td class="text-xs-right">
                              <v-text-field v-model="order.tax" @input="calculateTax()" ></v-text-field>
                            </td>
                            <td class="text-xs-right">{{ order.taxAmt }}</td>
                          </tr>
                          <tr>
                            <td colspan="5" class="text-xs-right"><strong>Total Amount</strong></td>
                            <td  class="text-xs-right">{{ order.grand_total }}</td>
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

        <v-btn color="indigo" fab dark absolute top left @click.native="createOrderDialog = true">
          <v-icon dark>group_add</v-icon>
        </v-btn>

        <v-list>
          <v-layout row wrap header>
            <h1>Welcome To Inventory Management</h1>
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
        createOrderDialog: false,
        loginPage: false,
        employe: {},
        productList: [],
         
        order: {
          total:0,
          taxAmt:0,
          grand_total:0,
          orderDetails: [{
          product_id: '',
          qty: 1,
          size: {},
          price: 0,
          index: 0,

        }],
        },
       
        rules: {
          required: value => !!value || 'Required.',
          required: value => !isNaN(value) || 'Number Required.',
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
      this.getAllProduct()
    },
    methods: {
      saveDate(date) {
        this.$refs.menu.save(date)
      },


       save() {
        Axios.post(`${apiURL}/api/v1/order`, this.order)
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
        this.order.taxAmt= (this.order.tax * this.order.total)/100;         
        this.order.grand_total = this.order.total+this.order.taxAmt;
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
          console.log(data)
        ))
      },

    }
  }

</script>
