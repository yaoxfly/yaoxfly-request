<template>
  <div class="home">
    <img alt="Vue logo"
         src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
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
    console.log(this.$YxRequest)
    this.$YxRequest.requests('test/test', { name: '1', age: '1' }, 'put', false).then(res => {
      console.log(res)
    })
  }
}
</script>
