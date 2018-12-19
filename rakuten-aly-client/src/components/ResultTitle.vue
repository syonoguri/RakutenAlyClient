<template>
    <div class="resultTitle">
        <h2>分析結果</h2>
        <p>{{errorMessage}}</p>
        <transition>
         <div v-show="this.$store.state.loading" class="loadingText">Loading...</div>
        </transition>
    </div>
</template>

<script>
export default {
    computed:{
      errorMessage(){
          return this.$store.state.errorMessage;
      }
  }
}
</script>
<style>
p{
    text-align: center;
}
.loadingText {
    font-size: 18px;
    font-weight: bold;
}
.v-enter-active, .v-leave-active {
    transition: opacity 1s;
}
.v-enter, .v-leave-to {
    opacity: 0;
}
</style>