
<template>
    <div class="flex flex-col md:flex-row gap-3 items-center">
      <span>Виберіть БД для завантаження:</span>
      <RecordsPerPageSelector 
        v-if="LISTS_BD_NAME_IN_LOAD"
        :model-value="choiceBD"
        :options="LISTS_BD_NAME_IN_LOAD"
        :description="'Виберіть БД'"
        @update:model-value="addBD"
      />

      <RecordsPerPageSelector 
        v-if="listsNameBD"
        :model-value="choiceTable"
        :options="listsNameBD"
        :description="'Виберіть таблицю'"
        @update:model-value="adTable"
      />
    </div>
</template>


<script setup>
import RecordsPerPageSelector from '@/components/RecordsPerPageSelector.vue'
import { LISTS_BD_NAME_IN_LOAD } from '@/constants'
import { ref } from 'vue';
import { useRequests } from '@/stores/requests'


const emit = defineEmits({
  tableData: Object,
  loading: [Boolean],
});


const choiceBD = ref('Виберіть БД')
const choiceTable = ref('Виберіть таблицю')
const listsNameBD = ref()
const requests = useRequests()


const addBD = async (val) => {
  emit('loading', true)
  choiceBD.value = val
  const result = await requests.requestDatabaseTablesData({nameTableBD: val});
    listsNameBD.value = result
    emit('loading', false)
}

const adTable = async (val) => {
  emit('loading', true)
  choiceTable.value = val
  const tablesData = await requests.requestTableData({ nameBD: choiceBD.value, nameTableBD: val});
    if(tablesData) {
    emit('tableData', {tablesData, nameBD: choiceBD.value, nameTableBD: val})
    }
    emit('loading', false)
}


</script>

<script>
export default {
  name: 'TheDownloadBD',
}
</script>

