<template>
    <div class="savedtable" v-show="this.$store.state.saved">
        <table>
            <caption>検索キーワード</caption>
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
    }
}
</script>