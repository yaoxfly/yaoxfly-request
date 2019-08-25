import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import YxRequest from './request'
import qs from 'qs'
import axios from 'axios'
Vue.config.productionTip = false
new Vue({
  router,
  store,
  YxRequest,

  mounted () {
    axios
      .delete(
        'index/index/getTest',
        {
          params: {
            test: [{ aa: '告诉' }]
          },
          paramsSerializer: function (params) {
            return qs.stringify(params)
          }
        }

        // {
        //   params: {
        //     test: 1
        //   },
      )
      .then(res => {
        console.log(res)
      })
  },
  render: h => h(App)
}).$mount('#app')
