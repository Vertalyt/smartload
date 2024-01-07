<template>
  <div class="m-4 flex flex-col items-center justify-center gap-3">
    <h2 class="w-max text-lg font-bold">Доступні таблиці:</h2>


      <RecordsPerPageSelector
      v-if="nameBD"
      :model-value="choiceBD"
      :options="nameBD"
      :description="'Виберіть БД'"
      @update:model-value="tableSelection"
    />

      <UserSelectedAccess
      v-if="editAccessTable"
      :item_access="editAccessTable"
      nameParam="table_name"
      @edit="$emit('table', $event)"
    />

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import RecordsPerPageSelector from "../RecordsPerPageSelector.vue";
import UserSelectedAccess from "./UserSelectedAccess.vue";
import { useBDAccess, itemsAccess } from '@/composables/UsersAccess'


const emit = defineEmits({
  table: Array,
  load: String,
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
  ollTablesName: {
    required: false,
    type: Array,
  },
});

const BD_access = computed(() => props.bd_access);
const nameBD = useBDAccess(BD_access);
const choiceBD = ref("Виберіть БД");


const tableSelection = async (val) => {
  emit("load", val);
  choiceBD.value = val;
};

const computedOllTablesName = computed(() => props.ollTablesName);
const computedTableAccess = computed(() => props.table_access)
// добавляю флаг к каждой таблицы, разрешена ли она
const editAccessTable = itemsAccess({
  items: computedOllTablesName, 
  itemsAccessFilter: computedTableAccess,
  type: 'table_name'
})

</script>

<script>
export default {
  name: "TableCheck",
};
</script>
