import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import YxRequest from './request'
Vue.config.productionTip = false
new Vue({
  router,
  store,
  YxRequest,
  render: h => h(App)
}).$mount('#app')
