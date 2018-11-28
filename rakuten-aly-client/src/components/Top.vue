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