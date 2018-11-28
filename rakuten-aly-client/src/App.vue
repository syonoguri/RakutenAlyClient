<template>
  <div id="app">
    <Top/>
    <Tables/>
  </div>
</template>


<script>
import Top from '@/components/Top.vue'
import Tables from '@/components/Tables.vue'
export default {
  name: 'App',
  components: {
    Top,
    Tables
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
