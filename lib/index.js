import Request from './request.js'
Request.install = Vue => {
  Vue.mixin({
    created () {
      const options = this.$options // vue的option 方法
      // 如果存在
      if (options.yxRequest) {
        // 混入vue实例的名字 定好就不可更改 在vue实例中添加  在new Vue()中添加 也要 vue.use()
        this.$yxRequest = options.yxRequest // 为这个值赋值为this.$yxRequest
      } else if (options.parent && options.parent.$yxRequest) {
        this.$yxRequest = options.parent.$yxRequest
      }
    }
  })
}
export default Request