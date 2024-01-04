
<template>
    <div class="flex flex-col md:flex-row gap-3 items-center">
      <span>Виберіть БД для завантаження:</span>
      <RecordsPerPageSelector 
        v-if="accessBD"
        :model-value="choiceBD"
        :options="accessBD"
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
import { ref, computed } from 'vue';
import { useRequests } from '@/stores/requests'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits({
  tableData: Object,
  loading: [Boolean],
});


const choiceBD = ref('Виберіть БД')
const choiceTable = ref('Виберіть таблицю')
const listsNameBD = ref()
const requests = useRequests()
const authStore = useAuthStore()

const accessBD = computed( () => {
  const date = authStore.getProperty('BD_access')
  return date ? date : ['Звернітся до адміністратора']
}) 
const table_access = computed( () => authStore.getProperty('table_access')) 

const addBD = async (val) => {
  if(table_access.value) {
    choiceBD.value = val
  const date = table_access.value.filter(b => b.bd_name === val);
  listsNameBD.value = date.map(item => item.table_name);
  } else {
    listsNameBD.value = ['Звернітся до адміністратора']
  }

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

