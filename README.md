# yaoxfly-request

#### 介绍

基于 axios/flyio 封装的一个请求库,支持 web、app、小程序(使用 fiyio 做请求)等 http 请求; 支持 restFul 接口 可发送,get post patch put delete 等请求; 支持 axios 和 fly.js 库的切换可进行拦截处理,自动弹出, http 请求错误、请求异常信息,未登录拦截等,具体实现通过配置参数、方法等实现。

#### 安装教程

npm i yaoxfly-request

#### 前期准备

在 src(源代码)文件夹新建 request 文件夹并在里面建立 index.js 文件,参考配置方案稍后详见。

#### restFul api 请求方法

- get

```js
this.$YxRequest
  .get(url, param, config)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

- post 请求

```js
this.$YxRequest
  .post(url, param, config)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

- patch 请求

```js
this.$YxRequest
  .patch(url, param, config)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

- put 请求

```js
this.$YxRequest
  .put(url, param, config)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

- delete 请求

```js
this.$YxRequest
  .delete(url, param, config)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

- 全部请求 可传各种类型请求， 可添加 headers 参数

```js
this.$YxRequest
  .requests(url, param, type, config)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

- 上传文件类型的请求 只能是 post 提交 可添加 headers 参数

```js
 this.$YxRequest.submitFormData(url,param, {loading = true, headers = {},timeout = 0 })
 .then(res => {
     console.log(res);s
 })
 .catch(err =>{
   console.log(err);
 })

```

#### 方法参数说明

在 this.\$YxRequest 可调用的方法的里参数说明
| 参数 |类型| 说明 |是否必填|
|:---:| :--: | :----: |:--:|
| url | String |api 地址 | true|
| param | Object |后台 接收的参数 |true|
| config | Object | 扩展配置项 添加如 qs、loading 等配置|false|
| type| String| 请求类型 如 get、post、patch、put、delete 等，当前参数只有 requests 方法可设置， 默认是 post| false |

config 配置参数说明
| 参数 |类型| 说明 |是否必填|
|:---:| :--: | :----: |:--:|
| loading| Boolean| 当前请求是否开启 loading 默认是 true| false|
| qs| Boolean| 是否开启 qs 强转 默认是 true| false |
| headers | Object | 传 headers 参数 默认是 {}, 当前参数只有 submitFormData、requests 方法可设置 |false|
| timeout | Number | 超时时间 默认为 0 无限制 当前参数只有 submitFormData 方法 能设置|false|

#### request/index.js 配置说明

- 在 request/index.js 文件里引入 yaoxfly-request

```js
import YxRequest from "yaoxfly-request";
Vue.use(YxRequest);
export default new YxRequest({});
```

- 在 main.js 文件里

```js
import YxRequest from "./request";
new Vue({
  router,
  store,
  YxRequest, //当前名字不可更改 一定要YxRequest
  render: h => h(App)
}).$mount("#app");
```

- request/index.js 配置参考

```js
import Vue from "vue";
import Fly from "flyio/dist/npm/fly.js";
import qs from "qs";
import YxRequest from "yaoxfly-request";
Vue.use(YxRequest);
const $this = new Vue(); //实例化 vue,普通的 this 用不了
const ONLINE_DOMAN_NAME =
  window.location.protocol + "//" + window.location.host; //协议加域名
let loading = ""; //动画
const fly = new Fly();
export default new YxRequest({
  //请求配置
  requestConfig: {
    request: fly, //请求名 flyio/axios
    type: "fly", //请求类型
    qs: qs,
    headers: {
      token: 22221111,
      "content-Type": "application/x-www-form-urlencoded" //php 的 post 传输请求头一定要这个 不然报错 接收不到值
    },
    timeout: 30000,
    baseURL:
      process.env.NODE_ENV === "development"
        ? "http://www.ericssons.com"
        : ONLINE_DOMAN_NAME + "/project/ericsson/",
    withCredentials: true
  },
  //动画配置
  loading: {
    isLoading: true, //是否开启动画
    limitTime: 200, // 接口请求在 xxxms 内完成则不展示 loading
    loadingShow: () => {
      loading = $this.$loading({
        lock: false,
        background: "rgba(0, 0, 0, 0.1)"
      });
    },
    loadingHide: () => {
      if (loading) {
        loading.close();
      }
    }
  },
  //错误自动提示
  resError: {
    key: "code", // 与后台规定的状态码的值
    msg: "msg", //与后台规定的消息值 key 值必须是 msg 右边可改
    value: -1, // 与后台规定的表示登录失败的 code 值
    // 接口异常默认提示的方法
    tipShow: err => {
      // console.log(err)
      setTimeout(() => {
        $this.$message(err);
      }, 200);
    },

    //登录失败提示并跳转
    notLogin: err => {
      // console.log(err)
      setTimeout(() => {
        $this.$message(err);
      }, 200);

      setTimeout(() => {
        window.location = "http://www.baidu.com";
      }, 1000);
    },

    //不成功的提示
    notSuccessful: (code, err) => {
      //0 成功 -6有继续操作的错误提示 -1 登录
      switch (code) {
        case 0:
        case -6:
        case -1:
          break;
        default:
          setTimeout(() => {
            $this.$message(err);
          }, 200);
      }
    }
  },

  //路由登录权限控制 (可以让路由不需要登录,也可跳转)false不需要验证,根据uni-app进行配置的如有报错可修改或删除。
  accessControl: {
    routeValidate: () => {
      let pages = getCurrentPages(); //获取加载过的路由
      let currPage = pages[pages.length - 1]; //获取当前页路由
      switch (currPage.route) {
        case "pages/advisory/counselor/CounselorList":
        case "pages/advisory/counselor/CounselorInfo":
          return false;
        default:
          return true;
      }
    }
  }
});
```

> tips:当前 loading 使用的是 elementUi 的动画可自行修改,需要下载 flyio/axios、qs、elementUi。

##### 配置参数

- 请求配置 requestConfig \*

```js
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

- 请求拦截 loading 配置 \*

```js
loading: {
    isLoading: true, //是否开启动画
    limitTime: 200, //接口请求在 xxxms 内完成则不展示 loading
    loadingShow: () => {//动画展示 请求拦截前
    },
    loadingHide: () => {//动画关闭 请求拦截后
    }
  }

```

- 请求错误 resError 配置 \*

```js
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

- 路由权限 accessControl 配置

```js
//路由登录权限控制 (可以让路由不需要登录,也可跳转) 返回值是 false不需要验证 true 需要验证
accessControl: {
  routeValidate: () => {};
}
```

> tips:以上不打\*号的不是必须配置可自行决定是否配置
