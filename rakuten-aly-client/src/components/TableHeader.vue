<template>
    <thead>
        <tr>
            <th>RANK</th>
            <th>SCORE</th>
            <th>KEYWORD 
                <form>
                    <input v-model="filterWord">
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
    computed: {
        filterWord: {
            set(value){
                if(this.val){
                    this.$store.commit("updateFilterWord",value)
                } else {
                    this.$store.commit("updateSavedFilterWord",value)
                }
                
            }
        }
        
    },
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

<style>
button{
    border: 1px solid gray;
    border-radius: 6px;
    padding: 3px 5px;
    font-size: 14px;
    margin-left: 5px;
}
form{
    display: inline-block;
    padding: 0;
    font-size: 12px;
    width: 200px;
}
input{
    width:75%;
    height: 18px;
}
</style>