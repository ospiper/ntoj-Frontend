import Vue from 'vue'
import Vuex from 'vuex'
import { extractVuexModule, createProxy } from 'vuex-class-component';
import { AppStore } from './app';

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(AppStore)
  }
});

export const vxm = {
  app: createProxy(store, AppStore)
}
