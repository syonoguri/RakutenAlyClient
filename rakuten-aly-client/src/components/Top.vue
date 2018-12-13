<template>
    <div class="top">
        <h1>楽天商品タイトル重要ワード抽出</h1>
        <p>入力したキーワードにヒットする商品タイトルのうち、主要なキーワードを抽出します。</p>
        <MainForm/>
    </div>
</template>

<script>
import MainForm from '@/components/MainForm.vue'
export default {
  name: 'Top',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  components: {
    MainForm
  }
}
</script>

<style>
.top{
    margin:0 auto 0 auto;
    padding-bottom: 20px;
    display: flex;
    flex-flow: column;
    background-color: brown; 
    color:white;
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
form {
    padding:16px;
    margin: auto;
}

input:focus{
    background-color: #faf3f3;
}
</style>