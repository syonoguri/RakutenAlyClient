<template>
    <tbody>
        <tr v-for="result in assignedAnalysisResult" :key="result.rank">
            <td>{{ result.rank }}</td>
            <td>{{ result.score }}</td>
            <td>{{ result.keyword }}</td>
        </tr>
    </tbody>
</template>

<script>
export default {
    props:["val"],
    name: 'TableBody',
    computed: {
        assignedAnalysisResult(){
            if(this.val){
                return this.$store.getters.computedAnalysisResult
            } else if(this.$store.state.saved) {
                return JSON.parse(JSON.stringify(this.$store.getters.computedAnalysisResult))
            }
        }
    }
}
</script>