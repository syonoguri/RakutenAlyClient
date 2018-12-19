<template>
    <div class="maintable">
        <table>
            <caption>{{resultCaption}}</caption>
            <TableHeader val="maintable"/>
            <TableBody val="maintable"/>
        </table>
    </div>
</template>

<script>
import TableHeader from "@/components/TableHeader.vue"
import TableBody from "@/components/TableBody.vue"
export default {
    name: 'MainTable',
    components: {
        TableHeader,
        TableBody
    },
    computed:{ 
        resultCaption(){
            return this.$store.state.resultCaption;
        }
    }
}
</script>

<style scoped>
div {
    margin:0 auto 0 auto;
}

</style>