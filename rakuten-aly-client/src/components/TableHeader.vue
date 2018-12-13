<template>
    <thead>
        <tr>
            <th>RANK</th>
            <th>SCORE</th>
            <th>KEYWORD 
                <form>
                    <input>
                </form>
                <button @click.prevent="switchReverse">↑↓</button>
                <button v-if="val" @click.prevent="switchSaved">save</button>
            </th>
        </tr>
    </thead>
</template>

<script>
export default {
    props:["val"],
    name: 'TableHeader',
    methods: {
        switchSaved(){
            this.$store.commit("switchSaved");
        },
        switchReverse(){
            if(this.val){
                this.$store.commit("switchReverse","");
            } else {
                this.$store.commit("switchReverse",true);
            }
            
        }
    }
}
</script>