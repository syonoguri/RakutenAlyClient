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
html{
    font-size: 15px;
}
body{
    margin:0;
    text-align: center;
    background-color: whitesmoke;
}
h1{
    font-size: 3rem;
    color: white;   
}
h2{
    color: black;
}
form {
    padding:16px;
}
input{
    box-sizing: border-box;
}
input{
    margin: auto;
    padding: 0.5em;
    width: 55%;
    font-size:16px;
}

input:focus{
    background-color: #faf3f3;
}
table {
    margin:0 auto 30px auto;
    border-collapse: collapse;
    background-color: white;
}
th,td {
    border: 1px solid #8fbac8;
    padding: 8px;
}
tr:nth-child(2n+2){
    background-color: #faf3f3;
}
thead tr{
    background-color: brown;
    color: white;
}
button{
    background-color: white;
}
button:hover {
    cursor: pointer;
    background-color: #faf3f3;
}

</style>
