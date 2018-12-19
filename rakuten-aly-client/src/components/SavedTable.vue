<template>
    <div class="savedtable" v-show="this.$store.state.saved">
        <table>
            <caption>{{savedResultCaption}}</caption>
            <TableHeader/>
            <TableBody/>
        </table>
    </div>
</template>

<script>
import TableHeader from "@/components/TableHeader.vue"
import TableBody from "@/components/TableBody.vue"
export default {
    name: 'SavedTable',
    components: {
        TableHeader,
        TableBody
    },
    computed:{
        savedResultCaption(){
            return this.$store.state.savedResultCaption;
        }
    },
}
</script>

<style scoped>
div {
    margin:0 auto 0 auto;
}
</style>