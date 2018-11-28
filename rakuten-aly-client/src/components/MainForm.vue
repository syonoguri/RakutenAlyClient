<template>
    <form method="POST" enctype="text/plain">
        <input v-model="inputedWord">  
        <button @click.prevent="submitToApi">送信</button> 
    </form>
</template>

<script>
export default {
    name: 'MainForm',
    methods: {
        submitToApi(){
            this.$store.dispatch("submitToApi")
        }
    },
    computed: {
        inputedWord: {
            get() { return this.$store.state.inputedWord},
            set(value) { this.$store.commit("updateInputedWord", value)}
        }
    }
}
</script>