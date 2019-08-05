/* eslint-disable */
import Vue from 'vue'
import Fly from 'flyio/dist/npm/fly.js'
import axios from 'axios'
import qs from 'qs'
import YxRequest from '../../lib'
const $this = new Vue() //实例化vue,普通的this用不了
const ONLINE_DOMAN_NAME = window.location.protocol + '//' + window.location.host //协议加域名
let loading = '' //动画

//3.在新的实例上使用组件
Vue.use(YxRequest)
const fly = new Fly()
export default new YxRequest({
  //请求配置
  requestConfig: {
    request: fly, //请求名 flyio/axios
    type: 'fly', //请求类型
    qs: qs,
    headers: {
      token: 22221111,
      'content-Type': 'application/x-www-form-urlencoded' //php的post传输请求头一定要这个 不然报错 接收不到值
    },
    timeout: 30000,
    // baseURL:
    //   process.env.NODE_ENV === 'development'
    //     ? 'http://www.yaoxfly.com/'
    //     : ONLINE_DOMAN_NAME + '/project/ericsson/',
    baseURL:
      process.env.NODE_ENV === 'development'
        ? 'http://www.ericssons.com'
        : ONLINE_DOMAN_NAME + '/project/ericsson/',
    withCredentials: true
  },

  loading: {
    //以下消息提示要200秒的延时 不然会被提前关闭 uni-app的坑 关闭一个所有消息都关闭
    isLoading: true, //是否开启动画
    limitTime: 200, // 接口请求在xxxms内完成则不展示loading
    compatible: 'uni-app', //防止uni-app关闭loading把消息也快速关闭,其他可不设置
    loadingShow: () => {
      loading = $this.$loading({
        lock: false,
        background: 'rgba(0, 0, 0, 0.1)'
      })
      // uni.showLoading({
      //   title: '加载中'
      //   // mask: true //不加mask 让其可操作
      // })
    },
    loadingHide: () => {
      // uni.hideLoading()
      if (loading) {
        loading.close()
      }
    }
  },

  resError: {
    key: 'code', // 与后台规定的状态码的值
    msg: 'msg', //与后台规定的消息值 key值必须是msg 右边可改
    value: -1, // 与后台规定的表示登录失败的code值
    // 接口异常默认提示的方法
    tipShow: err => {
      // console.log(err)
      setTimeout(() => {
        $this.$message(err)
      }, 200)
    },
    //登录失败提示
    notLogin: err => {
      // console.log(err)
      setTimeout(() => {
        $this.$message(err)
      }, 200)
      // setTimeout(() => {
      //   window.location.href = 'http://www.baidu.com'
      // }, 2000)
      // setTimeout(() => {
      //   let route = document.location //当前前端的路由
      //   let baseURL = //后端的接口地址,域名
      //     process.env.NODE_ENV === 'development'
      //       ? 'http://www.ericssons.com/'
      //       : ONLINE_DOMAN_NAME + '/project/ericsson/'
      //   window.location.href = `${baseURL}frontcommon/dockingFrontend/setUrl?url=${route}&types=1`
      // }, 1000)
    },

    //不成功的提示
    notSuccessful: (code, err) => {
      //0 成功 -6有继续操作的错误提示 -1 登录
      switch (code) {
        case 0:
        case -6:
        case -1:
          break
        default:
          setTimeout(() => {
            $this.$message(err)
          }, 200)
      }
      // setTimeout(() => {
      //   //主要是uni 关闭loading 会把showToast也关闭掉,所以要给点延时防止被瞬时关闭 延时少于200不生效
      //   uni.showToast({
      //     title: err,
      //     icon: 'none',
      //     mask: true,
      //     duration: 2000 //提示的延迟时间，单位毫秒，默认：1500
      //   })
      // }, 200)
    }
  },

  //路由登录权限控制 (可以让路由不需要登录,也可跳转) false 不需要验证
  accessControl: {
    routeValidate: () => {
      return true
      // let pages = getCurrentPages() //获取加载过的路由
      // let currPage = pages[pages.length - 1] //获取当前页路由
      // // console.log(currPage.route)
      // switch (currPage.route) {
      //   // case 'pages/advisory/counselor/CounselorList':
      //   // case 'pages/advisory/counselor/CounselorInfo':
      //   //   return false
      //   default:
      //     return true
    }
  }
})
