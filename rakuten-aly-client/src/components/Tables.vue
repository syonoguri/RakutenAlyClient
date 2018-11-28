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
  }
}
</script>
