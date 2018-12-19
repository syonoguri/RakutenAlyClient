<template>
    <div class="tables">
        <MainTable></MainTable>
        <SavedTable/>
    </div>
</template>

<script>
import MainTable from '@/components/MainTable.vue'
import SavedTable from '@/components/SavedTable.vue'
export default {
  name: 'Tables',
  components: {
    MainTable,
    SavedTable
  },
  data(){
      return{
          ifSaved: this.$store.getters.ifSaved,
      }
  },
  
}
</script>

<style>
.tables{
    margin:50px auto 0 auto;
    display: flex;
    max-width: 1300px;
    flex-flow: row;
    padding-bottom: 50px;
}

@media only screen and (max-width: 1000px){
    .tables{
        flex-flow: column;
    }
}

</style>