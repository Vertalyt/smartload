<template>
<TheLoader v-if="isLoading" />

  <div
    @click.stop
    class="z-50 rounded-md border border-gray-400 bg-gray-300/80"
  >

    <BdCheck 
    class="z-40 border-2 border-gray-400 rounded-md p-2 mx-2 my-0.5"
    v-if="bd_access && bd_lists"
    :bd_access="bd_access"
    :bd_lists="bd_lists"
    @BD="editAccessBD"
    />


    <TableCheck 
    class="z-40 border-2 border-gray-400 rounded-md p-2 mx-2 my-0.5"
    v-if="bd_access && table_access"
    :bd_access="bd_access"
    :table_access="table_access"
    :ollTablesName="ollTablesWithBD"
    @table="editAccessTable"
    @load="loadBDTable"
    />


    <ColsCheck
    class="z-40 border-2 border-gray-400 rounded-md p-2 mx-2 my-0.5"
    v-if="bd_access && table_access"
    :bd_access="bd_access"
    :table_access="table_access"
    :cols_access="cols_access"
    :ollCols="ollCols"
    @load="loadOllCols"
    @cols="editAccessCols"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BdCheck from "./BdCheck.vue";
import TableCheck from './TableCheck.vue'
import ColsCheck from './ColsCheck.vue'
import { useRequests } from "@/stores/requests";
import TheLoader from "@/components/TheLoader.vue";
import { TABLES_USERS_BD } from '@/constants'



const emit = defineEmits({
  edit: Object,
});
const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const requests = useRequests();
const users_access = ref();
const bd_lists = ref();
const isLoading = ref(false);
const bd_access = ref();
const table_access = ref();
const cols_access = ref()
// гружу разрешения пользователя на БД и таблицы. Составляю список БД
onMounted( async () => {
  users_access.value = await requests.requestUserData(props.id);
  bd_lists.value = await requests.requestTableData({
    nameBD: "BD_lists",
    nameTableBD: "BD_lists",
  });

    bd_access.value = users_access.value.userBD;
    table_access.value = users_access.value.t_access;
    cols_access.value =  users_access.value.c_access;
} )



const nameBD = ref()
// получаю имена таблиц по имени БД
const ollTablesWithBD = ref([]);
const loadBDTable = async(val) => {
  nameBD.value = val
  isLoading.value = true;
  try {
    ollTablesWithBD.value = await requests.requestDatabaseTablesData(val);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
  }
}

// ищу/сортирую массив для оставления только елементов для удаления
function findDelAccess({userParamAccess, newAccess, type}) {
 return userParamAccess.filter(b => {
  const access = newAccess.find(a => a === b[type])
  return !access ? b : undefined;
  })
}
// ищу/сортирую массив для оставления только елементов для добавления
function findAddAccess({userParamAccess, newAccess, type}) {
  return newAccess.map(b => {
  const access = userParamAccess.find(a => a[type] === b);
  return !access ? { 'user_id': props.id, [type]: b } : undefined;
}).filter(Boolean);
}

const editAccessBD = (val) => {
  const addAccess = findAddAccess({userParamAccess:bd_access.value, newAccess:val, type: 'bd_name' })
  if (addAccess.length) {
    bd_access.value = [...bd_access.value, ...addAccess]
         //   отправляю запрос на добавление права
    emit('edit', { value: addAccess, type: 'add', base: TABLES_USERS_BD.db_access })
  }

  const delAccessBD = findDelAccess({userParamAccess:bd_access.value, newAccess:val, type: 'bd_name' })
    // отправляю запрос на удаление права
  if(delAccessBD.length) {
    bd_access.value = bd_access.value.filter(b => !delAccessBD.find(d => d.bd_name === b.bd_name));
    emit('edit', { value: delAccessBD, type: 'del', base: TABLES_USERS_BD.db_access })
  }
}

const editAccessTable = (val) => {
  const filterTable = table_access.value.filter( t => t.bd_name === nameBD.value)

  let addAccess = findAddAccess({userParamAccess:filterTable, newAccess:val, type: 'table_name' })
  if (addAccess.length) {
    addAccess = addAccess.map(t => {
    return {
      ...t,
      'bd_name': nameBD.value,
    }
  })

  table_access.value = [...table_access.value, ...addAccess]

     //   отправляю запрос на добавление права
    emit('edit', { value: addAccess, type: 'add', base: TABLES_USERS_BD.t_access })
  }

  const delAccessTable = findDelAccess({userParamAccess:filterTable, newAccess:val, type: 'table_name' })
    // отправляю запрос на удаление права
  if(delAccessTable.length) {
     table_access.value = table_access.value.filter(b => !delAccessTable.find(
      d => d.table_name === b.table_name && d.bd_name === b.bd_name));
    emit('edit', { value: delAccessTable, type: 'del', base: TABLES_USERS_BD.t_access })
  }
}


const editAccessCols = val => {
   
  const filterTable = cols_access.value.filter( t => t.bd_name === nameBDCols.value && t.table_name === nameTable.value)

  let addAccess = findAddAccess({userParamAccess:filterTable, newAccess:val, type: 'cols_name' })
  if (addAccess.length) {
    addAccess = addAccess.map(t => {
    return {
      ...t,
      'bd_name': nameBDCols.value,
      'table_name' : nameTable.value,
    }
  })

     //   отправляю запрос на добавление права
    emit('edit', { value: addAccess, type: 'add', base: TABLES_USERS_BD.c_access, load: true })
  }

  const delAccessTable = findDelAccess({userParamAccess:filterTable, newAccess:val, type: 'cols_name' })
    // отправляю запрос на удаление права
  if(delAccessTable.length) {
    emit('edit', { value: delAccessTable, type: 'del', base: TABLES_USERS_BD.c_access, load: true })
  }

}


const ollCols = ref()
const nameTable = ref()
const nameBDCols = ref()
// запрашиваю все названия столбцов таблицы, и сохраняю название БД и таблицы для запросов
const loadOllCols = async ({ nameBD, nameTableBD }) => {
  nameTable.value = nameTableBD
  nameBDCols.value = nameBD
  ollCols.value = await requests.requestColsUser(nameBD, nameTableBD)
}

</script>

<script>
export default {
  name: "EditAccessUser",
};
</script>
