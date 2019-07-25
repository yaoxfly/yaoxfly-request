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
    this.$yxRequest.get('test/test', { name: '1', age: '1' }).then(res => {
      console.log(res)
    })
  }
}
</script>
