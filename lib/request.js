/* eslint-disable */
class Request {
  static className = 'YxRequest'
  loadingTimer = '' //请求loading的定时器
  request = '' //请求
  qs = '' //转换的类
  loading = true
  constructor(options = {}) {
    //es6的解构
    const {
      // 请求类的默认配置
      requestConfig: {
        request, //请求
        qs, //qs
        headers, //请求头
        timeout, //超时
        baseURL, //基本地址
        type, //请求类型
        withCredentials //是否携带session
      } = {},
      // 关于接口loading的配置
      loading: {
        isLoading, //是否动画加载
        limitTime, //定时器限制时间
        loadingShow, //关闭loading
        loadingHide //显示loading
      } = {},
      // 异常情况
      resError: {
        key, // 与后台规定的状态码
        value, //与后台规定的表示登录失败的code值
        msg, // 与后台规定的消息
        tipShow, // 接口异常默认提示的方法
        notSuccessful, //各种操作不成功的提示
        notLogin //登录失败提示
      } = {},
      //权限控制
      accessControl: {
        routeValidate //路由登录权限控制 (可以让路由不需要登录,也可跳转) false 不需要验证
      } = {}
    } = options || {} //有了{}主要是为了防止报错

    this.request = request
    this.qs = qs
    this.requestConfig(type, headers, timeout, baseURL, withCredentials)
    this.interceptorsRequest(isLoading, limitTime, loadingShow, loadingHide)
    this.interceptorsResponse(
      isLoading,
      limitTime,
      loadingShow,
      loadingHide,
      key,
      msg,
      value,
      tipShow,
      notSuccessful,
      notLogin,
      routeValidate
    )
  }
  //请求配置
  requestConfig(type = 'fly', headers, timeout, baseURL, withCredentials) {
    switch (type) {
      case 'fly':
        this.request.config.headers = headers //定义公共headers
        this.request.config.timeout = timeout //设置超时
        this.request.config.baseURL = baseURL //设置请求基地址
        this.request.config.withCredentials = withCredentials //跨域处理
        break
      case 'axios':
        this.request.defaults.baseURL = baseURL
        this.request.defaults.headers = headers
        this.request.defaults.timeout = timeout //设置超时
        this.request.defaults.withCredentials = withCredentials //跨域处理
        break
    }
  }
  //添加请求拦截器 发送前
  interceptorsRequest(isLoading, limitTime, loadingShow) {
    this.request.interceptors.request.use(res => {
      // 给所有请求添加自定义header 这里需要后端支持
      // request.headers["X-Tag"]="flyio";
      this.loadingTimer = setTimeout(
        () => {
          isLoading && this.loading && loadingShow()
        },
        limitTime ? limitTime : 0
      )
      return res
    })
  }
  //添加请求拦截器 发送后
  interceptorsResponse(
    isLoading,
    limitTime,
    loadingShow,
    loadingHide,
    key,
    msg,
    value,
    tipShow,
    notSuccessful,
    notLogin,
    routeValidate
  ) {
    // // 添加响应拦截器，响应拦截器会在then/catch处理之前执行(获取数据后)
    this.request.interceptors.response.use(
      response => {
        return new Promise(resolve => {
          if (isLoading && this.loading) {
            //uni-app 的hideLoading 会把showToast也关闭掉 要先开启再关闭
            //移动端需再开启后再关闭 PC端只要延迟关就好  //TODO: pc端可能不需要再开启 看框架需求 会出现重复的
            // loadingShow()
            //防止限制时间过长 可内容已经出现时未关闭
            clearTimeout(this.loadingTimer)
            //限制时间过短无法关闭情况
            setTimeout(
              () => {
                loadingHide()
              },
              limitTime ? limitTime : 0
            )
          }
          response =
            typeof response === 'string' ? JSON.parse(response) : response
          let data = //后台返回的data有可能是字符串 如果是就转换 tp5 json_encode会这样 基类中
            typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data

          //用[]才能拼接外面传进来的值data.key 只能获取自己的值
          if (data[key] === value && routeValidate()) {
            notLogin(data[msg])
            return
          }

          //如果不成功的情况下 弹出的信息
          notSuccessful(data[key], data[msg])
          return resolve(data) //这里直接输出了结果
        })
      },
      err => {
        return new Promise(() => {
          if (err && err.response) {
            switch (err.response.status) {
              case 400:
                err.message = '请求错误(400)'
                break
              case 401:
                err.message = '未授权，请重新登录(401)'
                break
              case 403:
                err.message = '拒绝访问(403)'
                break
              case 404:
                err.message = '请求出错(404)'
                break
              case 408:
                err.message = '请求超时(408)'
                break
              case 500:
                err.message = '服务器错误(500)'
                break
              case 501:
                err.message = '服务未实现(501)'
                break
              case 502:
                err.message = '网络错误(502)'
                break
              case 503:
                err.message = '服务不可用(503)'
                break
              case 504:
                err.message = '网络超时(504)'
                break
              case 505:
                err.message = 'HTTP版本不受支持(505)'
                break
              default:
                err.message = `服务器升级中,请稍后重试。(${
                  err.response.status
                })!`
            }
          } else {
            err.message = '网络超时,请稍后重试!'
          }

          clearTimeout(this.loadingTimer) // 请求结束就清掉定时器
          loadingHide() //隐藏loading
          tipShow(err.message) //显示异常信息
        })
      }
    )
  }

  /**  请求类 可用post或者get方法
   * @param {String} url api接口地址
   * @param {Object} params 传到后台的参数
   * @param {String} type 是get 还是post 请求
   * @param {Boolean} loading 是否开启loading动画
   * @return {Object} 返回请求结果
   */
  requests = (url, params = {}, type = 'post', loading = true) => {
    this.loading = loading
    return new Promise((resolve, reject) => {
      this.request
        .request(url, this.qs ? this.qs.stringify(params) : params, {
          method: type
        })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * 请求类 get方法 多用来获取数据
   * @param {String} url api接口地址
   * @param {Object} params 传到后台的参数
   * @param {Boolean} loading 是否开启loading动画
   * @return {Object} 返回请求结果
   */

  get = (url, params = {}, loading = true) => {
    this.loading = loading
    return new Promise((resolve, reject) => {
      this.request
        .get(url, this.qs ? this.qs.stringify(params) : params)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * 请求类 post 方法 多用来新增数据
   * @param {String} url api接口地址
   * @param {Object} params 传到后台的参数
   * @param {Boolean} loading 是否开启loading动画
   * @return {Object} 返回请求结果
   */
  post = (url, params = {}, loading = true) => {
    this.loading = loading
    return new Promise((resolve, reject) => {
      this.request
        .post(url, this.qs ? this.qs.stringify(params) : params)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * 请求类 put 方法 多用来修改数据（需要传递所有字段，相当于全部更新）
   * @param {String} url api接口地址
   * @param {Object} params 传到后台的参数
   * @param {Boolean} loading 是否开启loading动画
   * @return {Object} 返回请求结果
   */
  put = (url, params = {}, loading = true) => {
    this.loading = loading
    return new Promise((resolve, reject) => {
      this.request
        .put(url, this.qs ? this.qs.stringify(params) : params)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * 请求类 patch 方法 多用来修改数据，是在put的基础上新增改进的，适用于局部更新，比如我只想修改用户名，只传用户名的字段就ok了，而不需要像put一样把所有字段传过去
   * @param {String} url api接口地址
   * @param {Object} params 传到后台的参数
   * @param {Boolean} loading 是否开启loading动画
   * @return {Object} 返回请求结果
   */
  patch = (url, params = {}, loading = true) => {
    this.loading = loading
    return new Promise((resolve, reject) => {
      this.request
        .patch(url, this.qs ? this.qs.stringify(params) : params)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * 请求类 delete 方法 多用来删除数据
   * @param {String} url api接口地址
   * @param {Object} params 传到后台的参数
   * @param {Boolean} loading 是否开启loading动画
   * @return {Object} 返回请求结果
   */
  delete = (url, params = {}, loading = true) => {
    this.loading = loading
    return new Promise((resolve, reject) => {
      this.request
        .delete(url, this.qs ? this.qs.stringify(params) : params)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default Request