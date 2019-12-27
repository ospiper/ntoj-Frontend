<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import Component from 'vue-class-component';
import { vxm } from '@/store';

@Component({
  components: { HelloWorld }
})
export default class App extends Vue {
  version = vxm.app.version;
  appName = vxm.app.appName;

  mounted() {
    vxm.app.changeTitle('TITLE');
  }
}
</script>
