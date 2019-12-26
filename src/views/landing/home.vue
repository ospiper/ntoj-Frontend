<template>
  <v-container>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon
        @click.stop="orgDrawer = !orgDrawer"
        class="hidden-lg-and-up"
      />
      <v-toolbar-title class="font-weight-light">{{appName}}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer app clipped v-model="orgDrawer">
      <v-list-item>
        <v-list-item-avatar>
          <v-avatar>
            <v-img src="https://randomuser.me/api/portraits/women/81.jpg"/>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            Username
          </v-list-item-title>
          <v-list-item-subtitle>
            IntactClass
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider/>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>加入课程</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-subheader>Courses</v-subheader>
      <v-list-item two-line link>
        <v-list-item-content>
          <v-list-item-title>Course 1</v-list-item-title>
          <v-list-item-subtitle>Created by User 1</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-row>
      <v-col cols="12" md="6">
        <h1>近期活动</h1>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { vxm } from '@/store';

@Component
export default class Home extends Vue {
  appName: string = vxm.app.appName;
  orgDrawer: boolean = true;
}
</script>