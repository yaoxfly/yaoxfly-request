# yaoxfly-request

#### 介绍

基于 axios 和 fly 等 封装的一个请求库 支持 restFul 接口 支持 get post patch put delete 等请求 支持 axios 和 fly.js 库的切换 可进行拦截处理 自动弹出 http 请求错误、请求异常信息,未登录拦截等,可自行设置参数,方法等。

#### 安装教程

npm i yaoxfly-request

#### 使用说明

####1 插件配置
在 src(源代码)文件夹新建 request 文件夹并在里面建立 index.js 文件,参考配置方案稍后详见。

####2 restFul api 请求

#####get 请求

```
 this.$yxRequest.get('test/test', { name: '1', age: '1' }).then(res => {
 console.log(res)
 })
```

#####post 请求

```
 this.$yxRequest.put(url,param,isLoading).then(res => {
 console.log(res)
 })

```

#####patch 请求

```
 this.$yxRequest.patch(url,param).then(res => {
 console.log(res)
 })
```

#####put 请求

```
 this.$yxRequest.put(url,param).then(res => {
 console.log(res)
 })

```

#####delete 请求

```
 this.$yxRequest.delete(url,param).then(res => {
 console.log(res)
 })
```

#####全部请求 可传类型请求

```
 this.$yxRequest.requests(url,param,type,isLoading).then(res => {
 console.log(res)
 })
```

####3 方法参数说明
在 this.\$yxRequest 可调用方法的参数说明
| 参数 |类型| 说明 |
|:---:| :--: | :----: |
| url | String |api 地址 |
|param | Object |后台 接收的参数 |
| isLoading| Boolean| 当前请求是否开启 loading 默认是 true|
|type| String| 请求类型 如 get post get patch 等 当前参数只有 requests 方法可设置|

####4 request/index.js 配置说明

##### 在 request/index.js 文件里引入 yaoxfly-request

```
import yxRequest from 'yaoxfly-request'
Vue.use(yxRequest)
export default new yxRequest({
})
```

#####在 main.js 文件里

```
import yxRequest from './request'
new Vue({
  router,
  store,
  yxRequest, //当前名字不可更改 一定要yxRequest
  render: h => h(App)
  }).$mount('#app')
```

######注意 : 导入名一定要 yxRequest 不可更改

##### 配置参数

1. 请求配置 requestConfig \*

```
requestConfig: {
  request: '', //请求名 flyio/axios
  type: '', //请求类型
  qs: '', //qs
  headers: {}//请求头
  timeout: 30000, //请求超时
  baseURL:'' //基础地址
  withCredentials: true //是否跨域携带cookie
}
```

2. 请求拦截 loading 配置 \*

```
loading: {
    isLoading: true, //是否开启动画
    limitTime: 200, //接口请求在 xxxms 内完成则不展示 loading
    loadingShow: () => {//动画展示 请求拦截前
    },
    loadingHide: () => {//动画关闭 请求拦截后
    }
  }

```

3. 请求错误 resError 配置 \*

```
resError: {
  key: '', // 与后台规定的状态码的值
  msg: '', //与后台规定的消息值
  value: '', // 与后台规定的表示登录失败的 code 值
  tipShow: err => { // 接口异常提示的方法 http请求错误提示
  },
  notLogin: err => { //登录失败提示并设置跳转到登录 界面
  },
  notSuccessful: (code, err) => { //后台接口请求不成功的提示 不是异常错误 比如电话不能为空等提示
  }
}
```

4. 路由权限 accessControl 配置

```
//路由登录权限控制 (可以让路由不需要登录,也可跳转) 返回值是 false不需要验证 true 需要验证
accessControl: {
  routeValidate: () => {}
}

```

#####注意:以上不打\*号的不是必须配置可自行决定是否配置

####5 request/index.js 配置参考

1. 需要下载 flyio/axios 、 qs 、 elementUi
2. 以下 loading 有用到 elementUi 可自行修改

```
import Vue from 'vue'
import Fly from 'flyio/dist/npm/fly.js'
<!-- import axios from 'axios' -->
import qs from 'qs'
import yxRequest from 'yaoxfly-request'
Vue.use(yxRequest)
const $this = new Vue() //实例化 vue,普通的 this 用不了
let loading = '' //动画
const fly = new Fly()
export default new yxRequest({
  //请求配置
  requestConfig: {
    request: fly, //请求名 flyio/axios
    type: 'fly', //请求类型
    qs: qs,
    headers: {
       token: 22221111,
      'content-Type': 'application/x-www-form-urlencoded' //php 的 post 传输请求头一定要这个 不然报错 接收不到值
    },
    timeout: 30000,
    baseURL:
    process.env.NODE_ENV === 'development'
    ? 'http://www.ericssons.com'
    : ONLINE_DOMAN_NAME + '/project/ericsson/',
    withCredentials: true
  },
  loading: {
    isLoading: true, //是否开启动画
    limitTime: 200, // 接口请求在 xxxms 内完成则不展示 loading
    loadingShow: () => {
      loading = $this.$loading({
        lock: false,
        background: 'rgba(0, 0, 0, 0.1)'
     })
    },
    loadingHide: () => {
      if (loading) {
        loading.close()
      }
    }
  },

  resError: {
    key: 'code', // 与后台规定的状态码的值
    msg: 'msg', //与后台规定的消息值 key 值必须是 msg 右边可改
    value: -1, // 与后台规定的表示登录失败的 code 值
    // 接口异常默认提示的方法
    tipShow: err => {
      // console.log(err)
      setTimeout(() => {
        $this.$message(err)
      }, 200)
    },

    //登录失败提示并跳转
    notLogin: err => {
      // console.log(err)
      setTimeout(() => {
        $this.$message(err)
      }, 200)

      setTimeout(() => {
         window.location='http://www.baidu.com'
       }, 1000)
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
     },
   }

  //路由登录权限控制 (可以让路由不需要登录,也可跳转) false 不需要验证
    accessControl: {
      routeValidate: () => {
        let pages = getCurrentPages() //获取加载过的路由
        let currPage = pages[pages.length - 1] //获取当前页路由
        console.log(currPage.route)
        switch (currPage.route) {
          case 'pages/advisory/counselor/CounselorList':
          case 'pages/advisory/counselor/CounselorInfo':
           return false
          default:
            return true
       }
      }
  })
```

#####注意:当前 loading 使用的是 elementUi 的动画可自行修改

#### 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request
