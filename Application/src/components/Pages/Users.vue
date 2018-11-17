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
        <h3>Users</h3>

        <v-dialog v-model="dialog2" fullscreen transition="dialog-bottom-transition" :overlay="false" scrollable>

          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="dialog2 = false" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Employe</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat v-if="!employe._id" @click.native="save()">Save</v-btn>
                <v-btn dark flat v-if="employe._id" @click.native="update()">Update</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-form ref="form" v-model="valid">
              <v-list three-line subheader>
                <v-subheader>User Controls</v-subheader>
                <v-divider></v-divider>
                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-text-field prepend-icon="person" label="Employe Name " :rules="[rules.required]" v-model="employe.name"></v-text-field>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-text-field prepend-icon="person_outline" label="Employe Username " :rules="[rules.required]"
                      v-model="employe.username"></v-text-field>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-text-field prepend-icon="mail" label="Employe Email " v-model="employe.email"></v-text-field>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-text-field prepend-icon="phone" label="contact No " v-model="employe.tel_no" required></v-text-field>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-text-field prepend-icon="star" label="New Password" :rules="[rules.password]" v-model="employe.password"
                      required></v-text-field>
                  </v-list-tile-content>
                </v-list-tile>

              </v-list>
              <v-divider></v-divider>
              <v-list three-line subheader>
                <v-subheader>Role</v-subheader>
                <v-radio-group v-model="employe.role">
                  <v-list-tile avatar>
                    <v-list-tile-action>
                      <v-radio name='emp' :value="`employe`"></v-radio>
                    </v-list-tile-action>
                    <v-list-tile-content for="emp">
                      <v-list-tile-title>Employe</v-list-tile-title>
                      <v-list-tile-sub-title>users</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>



                  <v-list-tile avatar>
                    <v-list-tile-action>
                      <v-radio :value="`admin`"></v-radio>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Admin</v-list-tile-title>
                      <v-list-tile-sub-title>Admin rights</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                </v-radio-group>
              </v-list>
            </v-form>
          </v-card>
        </v-dialog>




        <v-btn color="indigo" fab dark absolute top left @click="create()">
          <v-icon dark>group_add</v-icon>
        </v-btn>




        <v-card>
          <v-card-title>
            Users
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="usersList" item-key="name" :search="search" class="elevation-1"
            :rows-per-page-items="pageSetup">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.username }}</td>
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.role.toUpperCase() }}</td>
              <td class="text-xs-center">
                <v-btn v-on:click="editEmploye(props.item)" outline fab small color="indigo">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn v-on:click="confirmDelete(props.item)" outline fab small color="indigo">
                  <v-icon>remove</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card>


        <v-dialog v-model="deleteDialog" max-width="330">
          <v-card>
            <v-card-title class="headline">Delete User</v-card-title>

            <v-card-text>
              Are you sure you want to delete this user ?
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" flat="flat" @click="deleteDialog = false">
                No
              </v-btn>

              <v-btn color="green darken-1" flat="flat" @click="deleteUserAction()">
                Yes
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
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  console.log(apiURL)
  export default {
    data() {
      return {
        validated: 1,
        valid:true,
        snackbar: false,
        snackbarMessage: "",
        deleteDialog: false,
        deleteUser: {},
        pageSetup: [20, 30, 40, {
          "text": "$vuetify.dataIterator.rowsPerPageAll",
          "value": -1
        }],
        snackbarColor: "success",
        loginPage: false,
        dialog2: false,
        search: '',
        usersList: [],
        role: this.$cookie.get('role'),
        employe: {
          username: '',
          password: '',
          emp_id: '',
          email: '',
          _id: '',
          tel_no: '',
          leaves: {
            privilege: null
          },
          role: 'employe'
        },
          rules: {
          required: value => !!value || 'Required.',
          password: value => {
            console.log(this.employe._id!=='' || !!value);
            return this.employe._id!=='' || !!value
           },                    
        },
        headers: [{
            text: 'Username',
            align: 'center',
            sortable: false,
            value: 'username'
          },
          {
            text: 'Email',
            align: 'center',
            value: 'Action'
          },
          {
            text: 'Role',
            align: 'center',
            value: 'Role'
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
      this.getAllUsers()
    },
    methods: {
      create() {
        this.dialog2 = true;

        this.employe = {
          username: '',
          password: '',
          emp_id: '',
          email: '',
          _id: '',
          tel_no: '',
          role: 'employe',
          leaves: {
            privilege: null
          },
        };
      },

      save() {
        if (this.$refs.form.validate()) {
          Axios.post(`${apiURL}/api/v1/signup`, this.employe)
            .then(({
              data: {
                token
              }
            }) => {
              this.dialog2 = false;
              this.getAllUsers();
              this.snackbarMessage = "User Succesfuly Created";
              this.snackbarColor = "green";
              this.snackbar = true;
            }).catch(({
              response: {
                data
              }
            }) => {
              this.snackbarMessage = "Duplicate Username or something went wrong";
              this.snackbar = true;
              this.snackbarColor = "error";


            })
        }
      },
      getAllUsers(context) {
        Axios.get(`${apiURL}/api/v1/users`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.usersList = data,
          console.log(data)
        ))
      },

      editEmploye(emp) {
        delete emp.password;
        this.dialog2 = true;
        this.employe = Object.assign({},emp);
      },

      confirmDelete(user) {
        this.deleteDialog = true;
        this.deleteUser = user;
      },

      deleteUserAction() {

        const currentUserId = this.$cookie.get('id');
        if (currentUserId == this.deleteUser._id) {
          this.snackbarMessage = "Cannot delete login user";
          this.snackbar = true;
          this.snackbarColor = "error";
          this.deleteDialog = false;
        } else {
          Axios.put(`${apiURL}/api/v1/user/delete`, this.deleteUser, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            }
          }).then(({
            data
          }) => {
            this.snackbarMessage = "User Succesfuly Delete";
            this.snackbarColor = "green";
            this.snackbar = true;
            this.deleteDialog = false;
            this.getAllUsers();
          }).catch(({
            response: {
              data
            }
          }) => {
            this.snackbarMessage = "Something went wrong";
            this.snackbar = true;
            this.snackbarColor = "error";
            this.deleteDialog = false;
          })
        }

      },

      update(context) {
        Axios.put(`${apiURL}/api/v1/user`, this.employe, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => {
          this.dialog2 = false;
          this.snackbarMessage = "User Succesfuly Updated";
          this.snackbarColor = "green";
          this.snackbar = true;
        }).catch(({
          response: {
            data
          }
        }) => {
          this.snackbarMessage = "Duplicate Username or something went wrong";
          this.snackbar = true;
          this.snackbarColor = "error";
        })
      },


    }
  }

</script>
