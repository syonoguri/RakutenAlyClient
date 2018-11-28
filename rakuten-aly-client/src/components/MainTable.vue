<template>
    <div class="maintable">
        <table>
            <caption>検索キーワード</caption>
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
    }
}
</script>