<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" v-if="signUpVisible == false">
              <v-toolbar dark color="primary">
                <v-toolbar-title width="100" style="width:100%">
                  <v-avatar size="60" color="indigo">
                    <v-icon size="60" dark>account_circle</v-icon>
                  </v-avatar>
                </v-toolbar-title>
                <v-spacer></v-spacer>

              </v-toolbar>
              <v-progress-linear color="indigo" v-if="loading" :indeterminate="true"></v-progress-linear>
              <v-card-text>
                <v-form v-model="validLogin" wrap @submit="submitAuthentication" @keyup.native.enter="submitAuthentication($event)">
                  <v-text-field v-model="credentials.username" prepend-icon="account_box" :rules="rules" required name="login"
                    label="Login" type="text"></v-text-field>
                  <v-text-field prepend-icon="lock" v-model="credentials.password" :rules="rules" :append-icon="loginPasswordVisible ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (loginPasswordVisible = !loginPasswordVisible)" :type="loginPasswordVisible ? 'text' : 'password'"
                    required name="password" label="Password" id="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="submitAuthentication()">Login</v-btn>
              </v-card-actions>
            </v-card>

            <v-card class="elevation-12" v-if="signUpVisible">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Sign Up form</v-toolbar-title>
                <v-spacer></v-spacer>

              </v-toolbar>

              <v-card-text>
                <v-form v-model="validSignUp">
                  <v-text-field label="Username" v-model="newUser.username" prepend-icon="account_box" :rules="rules"
                    required>
                  </v-text-field>

                  <v-text-field label="Employe ID" v-model="newUser.emp_id" prepend-icon="account_box" :rules="rules"
                    required>
                  </v-text-field>

                  <v-text-field label="Password" v-model="newUser.password" prepend-icon="lock" :rules="rules"
                    :append-icon="signUpPasswordVisible ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (signUpPasswordVisible = !signUpPasswordVisible)"
                    :type="signUpPasswordVisible ? 'text' : 'password'" required>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="signUpVisible=false">Login</v-btn>
                <v-btn block color="primary" type="submit">Login</v-btn>
                <v-btn block color="primary" @click.native="submitSignUp()">Sign Up</v-btn>
              </v-card-actions>
            </v-card>
            <v-snackbar bottom="bottom" color="red lighten-1" v-model="snackbar">
              {{ message }}
            </v-snackbar>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
  import Authentication from '@/components/pages/Authentication'
  export default {
    data() {
      return {
        snackbar: false,
        validLogin: false,
        validSignUp: false,
        signUpVisible: false,
        loginPasswordVisible: false,
        signUpPasswordVisible: false,
        loading: false,
        rules: [(value) => !!value || 'This field is required'],
        credentials: {
          username: '',
          password: ''
        },
        newUser: {
          username: '',
          password: ''
        },
        message: ''
      }
    },
    methods: {
      submitAuthentication() {
        this.loading = true;
        Authentication.authenticate(this, this.credentials, '/')
      },

      submitSignUp() {
        Authentication.signup(this, this.newUser, '/')
      }
    }
  }

</script>
