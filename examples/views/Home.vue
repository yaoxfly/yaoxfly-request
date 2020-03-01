<template>
  <div class="home">
    <img alt="Vue logo"
         src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />

    <input type="file"
           @change="test">
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },

  mounted () {
    // this.restFulTest()
  },
  methods: {

    /** ajax表单提交
   * @param  {String}  e 文件
   * @return {Object} 返回请求结果
   */
    formSummitTest (e) {
      let formData = new FormData();
      formData.append("excel", e.target.files[0]); //添加文件
      // https://alexxj.mralex.cn/project/ericsson/teacher/psychologistImport
      this.$YxRequest
        .submitFormData("http://www.ericssons.com/teacher/psychologistImport", formData,
          {
            headers: { sid: 1 },
          })
        .then(res => {
          console.log(res);
        });
    },


    /** restFul API 测试
   * @param  {String}  e 文件
   * @return {Object} 返回请求结果
   */
    async restFulTest () {
      const res = await this.$YxRequest.patch('index/test', { test: "房间" })
      console.log(res)
    }
  }

}
</script>
