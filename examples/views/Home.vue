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

  },
  methods: {
    test (e) {



      let formData = new FormData();
      formData.append("excel", e.target.files[0]); // 
      // https://alexxj.mralex.cn/project/ericsson/teacher/psychologistImport
      this.$YxRequest
        .submitFormData("http://www.ericssons.com/teacher/psychologistImport", formData, true, { sid: 1 })
        .then(res => {
          console.log(res);
        });

    }
  }

}
</script>
