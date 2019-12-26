<template>
  <v-container class="fill-height" fluid>
    <v-app-bar
      app
    >
      <v-toolbar-title class="font-weight-light">{{appName}}</v-toolbar-title>
    </v-app-bar>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="4" offset-md="5" offset-lg="7">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>登录</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="loginForm" v-model="valid">
              <v-text-field
                ref="usernameField"
                label="用户名"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                v-model="loginCredential.username"
                :rules="rules"
                @keyup.enter.prevent="handleFocus('passwordField')"
              />

              <v-text-field
                id="password"
                label="密码"
                name="password"
                ref="passwordField"
                prepend-icon="mdi-lock"
                type="password"
                v-model="loginCredential.password"
                :rules="rules"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" tile
                   class="pl-8 pr-8 mb-2"
                   :loading="logging"
                   :disabled="!valid || logging"
                   @click="handleLogin"
            >
              登录
            </v-btn>
            <v-spacer/>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { vxm } from '@/store';
import { LoginCredential } from '@/models/LoginCredential';

@Component
export default class Login extends Vue {
  appName: string = vxm.app.appName;
  logging: boolean = false;
  valid: boolean = false;
  loginCredential: LoginCredential = {
    username: '',
    password: '',
  };

  rules: ((v: string) => boolean | string)[] = [
    v => !!v || '必填项'
  ];

  handleFocus(ref: string): void {
    const r = this.$refs[ref];
    if (r) {
      // @ts-ignore
      r.focus();
    }
  }

  handleLogin(): void {
    this.logging = true;
    setTimeout(() => {
      this.logging = false;
      this.$toasted.error('用户名或密码错误', {
        position: 'bottom-right',
        duration: 3000,
      })
    }, 1500);
  }

  mounted() {
    // @ts-ignore
    this.$refs.usernameField.focus();
  }
}
</script>