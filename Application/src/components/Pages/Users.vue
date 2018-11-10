<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
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

            <v-list three-line subheader>
              <v-subheader>User Controls</v-subheader>
              <v-divider></v-divider>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field prepend-icon="person" label="Employe Name " v-model="employe.name"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field prepend-icon="person_outline" label="Employe Username " v-model="employe.username"></v-text-field>
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
                  <v-text-field prepend-icon="star" label="New Password" v-model="employe.password" required></v-text-field>
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
          <v-data-table :headers="headers" :items="usersList" item-key="name" :search="search" class="elevation-1">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.username }}</td>
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.role.toUpperCase() }}</td>
              <td class="text-xs-center">
                <v-btn v-on:click="editEmploye(props.item)" outline fab color="indigo">
                  <v-icon>edit</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card>

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
        Axios.post(`${apiURL}/api/v1/signup`, this.employe)
          .then(({
            data: {
              token
            }
          }) => {
            this.getAllUsers();
          }).catch(({
            response: {
              data
            }
          }) => {})
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
        this.employe = emp;
      },

      update(context) {
        Axios.put(`${apiURL}/api/v1/user`, this.employe, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (console.log(data)))
      },


    }
  }

</script>
