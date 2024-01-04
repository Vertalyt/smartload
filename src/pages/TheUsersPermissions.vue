<template>
  <div class="flex flex-col items-center justify-center">
    <TheLoader v-if="isLoading" />
  </div>

  <ModalWrapper v-if="accessEditModal" @close="accessEditModal = false">
    <EditAccessUser
      v-if="users_access && bd_lists"
      :users_access="users_access"
      :id="userId"
      :bd_lists="bd_lists"
      @bd="editAccessBD"
    />
  </ModalWrapper>

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
    @tables="loadPermissionsBdTables"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRequests } from "@/stores/requests";
import { USERS, GROUPS_PARAM, TABLES_USERS_BD} from "@/constants";
import TheLoader from "@/components/TheLoader.vue";
import TheUsersInfo from "@/components/users/TheUsersInfo.vue";
import TheAddUser from "@/components/users/TheAddUser.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";
import EditAccessUser from "@/components/users/EditAccessUser.vue";

const requests = useRequests();

const isLoading = ref(false);
const usersParam = ref();
const usersGroups = ref();
const groupsVariable = ref();

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
    nameBD: USERS.nameBD,
    nameTableBD: USERS.nameTableBD,
    date: val,
    type: "edit",
  });
};

const addUser = async (val) => {
  requests.requestEditTable({
    nameBD: USERS.nameBD,
    nameTableBD: USERS.nameTableBD,
    date: val,
    type: "add",
  });
  // запрашиваю список пользователей заново, так как я не знаю айди который выдаст БД
  usersParam.value = await requests.requestTableData(USERS);
};

const delUser = async (id) => {
  requests.requestDelRecordTable({
    nameBD: USERS.nameBD,
    nameTableBD: USERS.nameTableBD,
    ID: id,
  });
  // запрашиваю список пользователей заново, так как я не знаю айди который выдаст БД
  usersParam.value = usersParam.value.filter((user) => user.ID !== id);
};

const users_access = ref();
const accessEditModal = ref(false);
const userId = ref();
const bd_lists = ref();

const loadPermissionsBdTables = async (id) => {
  accessEditModal.value = false;
  userId.value = id;
  users_access.value = await requests.requestUserData(id);
  bd_lists.value = await requests.requestTableData({
    nameBD: "BD_lists",
    nameTableBD: "BD_lists",
  });
  accessEditModal.value = true;
};


const editAccessBD = async (val) => {
  
  try {
    if (val.type === "add") {
    await requests.requestEditTable({
        nameBD: USERS.nameBD, 
        nameTableBD: TABLES_USERS_BD.db_access, 
        date: val.value[0], 
        type: 'add'
      })
    }

    if (val.type === "del") {
      await requests.requestDelRecordTable({
        nameBD: USERS.nameBD, 
        nameTableBD: TABLES_USERS_BD.db_access, 
        ID: val.value[0].id, 
      })
    }
  accessEditModal.value = false;
  } catch (error) {
    /* empty */
  }

};
</script>

<script>
export default {
  name: "TheUsersPermissions",
};
</script>
