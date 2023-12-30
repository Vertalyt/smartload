<template>
  <div class="flex flex-col items-center justify-center">
    <TheLoader v-if="isLoading" />
  </div>

  <TheAddUser 
  v-if="groupsVariable"
  :variable="groupsVariable"
  :usersGroups="usersGroups"
  @add="addUser"
  />

  <TheUsersInfo
  v-if="usersGroups && usersParam" 
  :usersGroups="usersGroups"
  :usersParam="usersParam"
  :groupsVariable="groupsVariable"
  @edit="isEdit"
  @del="delUser"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRequests } from "@/stores/requests";
import { USERS, GROUPS_PARAM } from "@/constants";
import TheLoader from "@/components/TheLoader.vue";
import TheUsersInfo from "@/components/users/TheUsersInfo.vue";
import TheAddUser from "@/components/users/TheAddUser.vue";


const requests = useRequests();

const isLoading = ref(false);
const usersParam = ref();
const usersGroups = ref();
const groupsVariable = ref()



onMounted(async () => {
  isLoading.value = true;

  // запрашиваю список пользователей
  usersParam.value = await requests.requestTableData(USERS);

  // запрашиваю группы доступа
  usersGroups.value = await requests.requestTableData(GROUPS_PARAM);
  groupsVariable.value = usersGroups.value.map((g) => g.group_name);
  isLoading.value = false;
});



const isEdit = (val) => {
    requests.requestEditTable({
    nameBD : USERS.nameBD, 
    nameTableBD : USERS.nameTableBD, 
    date : val, 
    type : 'edit'
  })
}

const addUser = async (val) => {
  requests.requestEditTable({
    nameBD : USERS.nameBD, 
    nameTableBD : USERS.nameTableBD, 
    date : val, 
    type : 'add'
  })
  // запрашиваю список пользователей заново, так как я не знаю айди который выдаст БД
  usersParam.value = await requests.requestTableData(USERS);
}

const delUser = async (id) => {
  requests.requestDelRecordTable({
    nameBD : USERS.nameBD, 
    nameTableBD : USERS.nameTableBD, 
    ID : id, 
  })
  // запрашиваю список пользователей заново, так как я не знаю айди который выдаст БД
  usersParam.value = usersParam.value.filter(user => user.ID !== id)
}


</script>

<script>
export default {
  name: "TheGroupPermissions",
};
</script>
