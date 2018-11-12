<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <v-container>
        <v-dialog v-model="productDialog" fullscreen transition="dialog-bottom-transition" :overlay="false" scrollable>
          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="productDialog = false" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Product</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat v-if="!product._id" @click.native="save()">Save</v-btn>
                <v-btn dark flat v-if="product._id" @click.native="update()">Update</v-btn>
              </v-toolbar-items>
            </v-toolbar>

            <v-card>
              <v-card-title>
                <span class="headline">Product</span>
              </v-card-title>
              <v-card-text>
                <v-alert :value="productResult.status" :type="productResult.type">{{productResult.message}}
                </v-alert>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Product Name " v-model="product.name"></v-text-field>
                    </v-flex>
                    <v-flex xs9 sm6 md3>
                      <v-autocomplete v-model="product.category_id" :items="categoryList" max-height="500" chips label="Category"
                        item-text="name" item-value="_id">
                        <template slot="selection" slot-scope="{ item, index }">
                          <v-chip>
                            <span>{{ item.name }}</span>
                          </v-chip>
                        </template>

                        <template slot="item" slot-scope="data">
                          <template v-if="typeof data.item !== 'object'">
                            <v-list-tile-content v-text="data.item"></v-list-tile-content>
                          </template>
                          <template v-else>
                            <v-list-tile-avatar class="dropdown_avatar">
                              <span class="red--text"> {{ data.item.name.charAt(0).toUpperCase() }}</span>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                              <v-list-tile-sub-title v-html="data.item.code"></v-list-tile-sub-title>
                            </v-list-tile-content>
                          </template>
                        </template>
                      </v-autocomplete>
                    </v-flex>
                    <v-flex xs3 sm3 md1>
                      <v-btn fab dark small color="indigo" @click.native="dialog = true">
                        <v-icon dark>add</v-icon>
                      </v-btn>

                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Product Code " v-model="product.code"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Product Description" v-model="product.description"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md4>
                      <v-checkbox :label="`Has Dimentions`" v-model="product.hasSize"></v-checkbox>
                    </v-flex>


                    <div style="display:flex" v-if="product.hasSize">
                      <v-flex xs12 sm6 md3>
                        <v-text-field label="Height" v-model="product.size.height" required></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md3>
                        <v-text-field label="Width" v-model="product.size.width" required></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm6 md3>
                        <v-text-field label="Unit Rate" v-model="product.size.rate" required></v-text-field>
                      </v-flex>

                    </div>
                    <v-flex xs12>
                      <v-flex md3>
                        <v-text-field label="Product Price" v-model="product.price" required></v-text-field>
                      </v-flex>
                    </v-flex>

                  </v-layout>
                </v-container>
                <small>*indicates required field</small>

              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="productDialog = false">Close</v-btn>
                <v-btn color="blue darken-1" dark flat v-if="!product._id" @click.native="save()">Save</v-btn>
              </v-card-actions>
            </v-card>
            <v-divider></v-divider>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog" persistent max-width="300px">
          <v-card>
            <v-card-title>
              <span class="headline">Category</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field label="Category Name*" v-model="category.name" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field label="Category Code" v-model="category.code"></v-text-field>
                  </v-flex>

                  <v-alert :value="categoryResult.status" type="error">{{categoryResult.error}}
                  </v-alert>

                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click.native="addCategory()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn color="indigo" fab dark absolute top left @click="create()">
          <v-icon dark>group_add</v-icon>
        </v-btn>

        <v-card-title>
          Product
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="productList" item-key="name" :loading="productLoading" :search="search"
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.code }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.description }}</td>
            <td>{{ props.item.price }}</td>
            <td class="text-xs-center">
              <v-btn v-on:click="editProduct(props.item)" outline fab  small color="indigo">
                <v-icon>edit</v-icon>
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
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  export default {
    data() {
      return {
        validated: 1,
        loginPage: false,
        productDialog: false,
        dialog: false,
        search: '',
        productLoading: true,
        productList: [],
        categoryList: [],
        categoryId: '',
        categoryResult: {
          status: false,
          error: ""
        },
        productResult: {
          status: false,
          type: 'error',
          message: ""
        },
        product: {
          size: {
            height: 0,
            width: 0,
            rate: 0
          }
        },
        category: {
          name: '',
          code: ''
        },
        headers: [{
            text: 'Code',
            align: 'center',
            sortable: false,
            value: 'code'
          },
          {
            text: 'Name',
            align: 'center',
            value: 'name'
          },
          {
            text: 'Desc',
            align: 'center',
            value: 'Role'
          },
          {
            text: 'Price',
            align: 'center',
            value: 'price'
          },
          {
            text: 'Edit',
            align: 'center',
            value: 'Edit'
          }
        ]
      }
    },
    mounted() {
      this.getAllProduct(),
        this.getCategory()
    },
    watch: {
      'product.size.height': function (value) {
        console.log(value);
        this.product.price = value * this.product.size.width * this.product.size.rate;
      },
      'product.size.width': function (value) {
        this.product.price = this.product.size.height * this.product.size.width * this.product.size.rate;
      },
      'product.size.rate': function (value) {
        this.product.price = this.product.size.height * this.product.size.width * this.product.size.rate;
      }


    },
    methods: {
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

      create() {
        this.productDialog = true;
		this.product = {
          size: {
            height: 0,
            width: 0,
            rate: 0
          }
        };
      },
      editProduct(product) {
        this.productDialog = true;
        this.product = product;
        if (!this.product.hasSize) {
          this.$set(this.product, 'size', {
            height: 0,
            width: 0,
            rate: 0
          })


        }
      },

      save() {

        const catCode = this.categoryList.filter(category => category._id == this.product.category_id);
        console.log(catCode[0]);
        console.log(this.product.category_id);
        this.product.catCode = catCode[0].code;
        Axios.post(`${apiURL}/api/v1/product`, this.product)
          .then(({
            data: {
              token
            }
          }) => {
            //this.getAllUsers();
            console.log(data);
            this.productResult.status = true;
            this.productResult.message = "Sucessfuly Added";
            this.productResult.type = "sucess"
            this.getAllProduct();
          }).catch(({
            response: {
              data
            }
          }) => {
            this.productResult.status = true;
            this.productResult.message = "Duplicate Entry or something went wrong";
            this.productResult.type = "error"
          })
      },

      getCategory() {
        Axios.get(`${apiURL}/api/v1/category`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.categoryList = data,
          console.log(data)
        ))

      },
      update(context) {
        Axios.put(`${apiURL}/api/v1/product`, this.product, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (console.log(data), this.productDialog = false, this.getAllProduct()))
      },

      addCategory() {
        Axios.post(`${apiURL}/api/v1/category`, this.category)
          .then(({
            data: {
              token
            }
          }) => {
            //this.getAllUsers();
            this.getCategory();
            this.dailog = false;

            console.log(data);
          }).catch(({
            response: {
              data
            }
          }) => {
            this.categoryResult.status = true;
            this.categoryResult.error = "Duplicate Entry";

          })
      },

    }
  }

</script>
