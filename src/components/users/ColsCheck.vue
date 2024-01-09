
<template>
  <div class="m-4 flex flex-col items-center justify-center gap-3">
    <h2 class="w-max text-lg font-bold">Доступні колонки:</h2>

    <div class="flex flex-col gap-3 sm:flex-row">
      <RecordsPerPageSelector
      v-if="nameBD"
      :model-value="choiceBD"
      :options="nameBD"
      :description="'Виберіть БД'"
      @update:model-value="tableSelection"
    />

    <RecordsPerPageSelector
      v-if="tableWithBDAccess"
      :model-value="choiceTable"
      :options="tableWithBDAccess"
      :description="'Виберіть таблицю'"
      @update:model-value="colsSelection"
    />
    </div>

    <UserSelectedAccess
      v-if="editAccessCols"
      :item_access="editAccessCols"
      nameParam="cols_name"
      @edit="$emit('cols', $event)"
    />

  </div>
</template>


<script setup>
import { ref, computed } from "vue";
import RecordsPerPageSelector from "../RecordsPerPageSelector.vue";
import UserSelectedAccess from "./UserSelectedAccess.vue";
import { useBDAccess, itemsAccess } from '@/composables/UsersAccess'

const emit = defineEmits({
  load: String,
  cols: Array
});
const props = defineProps({
  bd_access: {
    required: true,
    type: Array,
  },
  table_access: {
    required: true,
    type: Array,
  },
  cols_access: {
    required: true,
    type: Array,
  },
  ollCols: {
    required: false,
    type: Array,
  },
})

const BD_access = computed(() => props.bd_access);
const table_access = computed(() => props.table_access);
const nameBD = useBDAccess(BD_access);

const choiceBD = ref("Виберіть БД");

const cols_accessFilter = ref()
const tableWithBDAccess = ref()
const choiceTable = ref("Виберіть таблицю");

const tableSelection = (val) => {
  choiceBD.value = val;
  tableWithBDAccess.value = table_access.value.filter(t => t.bd_name === val).map(t => t.table_name)
};


const colsSelection = async (val) => {
  choiceTable.value = val
  cols_accessFilter.value = props.cols_access.filter(t => t.bd_name === choiceBD.value && t.table_name === val)
  emit('load', { nameBD:choiceBD.value, nameTableBD:val })
}

const computedOllCols = computed(() => props.ollCols )

// добавляю флаг к каждой таблицы, разрешена ли она
const editAccessCols = itemsAccess({
  items: computedOllCols, 
  itemsAccessFilter: cols_accessFilter, 
  type:'cols_name' })

</script>

<script>
export default {
  name: 'ColsCheck',
}
</script>