import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import yxRequest from './request/ajax'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  yxRequest,
  render: h => h(App)
}).$mount('#app')
