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

  created () {
    // this.$YxRequest
    //   .submitFormData("http://www.ericssons.com/singular/test", {},
    //     {
    //       timeout: 30000,
    //     })
    //   .then(res => {
    //     console.log(res);
    //   });
  },
  methods: {
    test (e) {
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
    }
  }

}
</script>
