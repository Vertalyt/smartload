<template>
  <div class="flex flex-col items-center justify-center">
    <TheLoader v-if="isLoading" />
  </div>

  <ModalWrapper
    class="width"
    v-if="accessEditModal"
    @close="accessEditModal = false"
  >
    <EditAccessUser v-if="userId" :info="userId" @edit="editAccess" />
  </ModalWrapper>

  <TheAddUser
    v-if="groupsVariable && usersLogin && usersGroups"
    :variable="groupsVariable"
    :usersGroups="usersGroups"
    :usersLogin="usersLogin"
    @add="addUser"
  />

  <TheUsersInfo
    v-if="usersGroups && usersParam"
    :usersGroups="usersGroups"
    :usersParam="usersParam"
    :groupsVariable="groupsVariable"
    @edit="isEdit"
    @del="delUser"
    @tables="tablesId"
  />
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRequests } from "@/stores/requests";
import { useAuthStore } from "@/stores/auth";
import { TABLES_USERS_BD } from "@/constants";
import TheLoader from "@/components/TheLoader.vue";
import TheUsersInfo from "@/components/users/TheUsersInfo.vue";
import TheAddUser from "@/components/users/TheAddUser.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";
import EditAccessUser from "@/components/users/EditAccessUser.vue";
import { useAddLdapParamSorts } from "@/functions";
import { useUsersLogin } from "@/composables/UsersAccess";
import { useAccessPage } from '@/composables/useAccess'

const requests = useRequests();

const isLoading = ref(false);
const usersParam = ref();
const usersGroups = ref();
const groupsVariable = ref();
const ollListsUsers = ref();
const usersLogin = ref();

const isLists = computed(() => requests.isUsersList);
const storeAuth = useAuthStore()

onMounted(async () => {
  useAccessPage('users')


  isLoading.value = true;

  // запрашиваю список пользователей
  usersParam.value = await requests.requestTableData(TABLES_USERS_BD.info);

  // запрашиваю группы доступа
  usersGroups.value = await requests.requestTableData(TABLES_USERS_BD.groups);

  // проверка на root и убираю с прав рута
  const idUser = storeAuth.getProperty("group_id");
  groupsVariable.value = usersGroups.value.map((g) => g.group_name);
  if(Number(idUser) !== 1) {
    groupsVariable.value = groupsVariable.value.filter(g => g!== 'root')
  }

  isLoading.value = false;

  // получаю массив всех пользователей
  if (!isLists.value) {
    ollListsUsers.value = await requests.requestsNameUsers();
  } else {
    ollListsUsers.value = requests.getUsersList;
  }
  // ищу пользователей с своей БД и обьединяю параметры инофрмации пользователей
  const { updatedOllListsUsers, updatedUsersParam } = useAddLdapParamSorts({
    usersParam,
    ollListsUsers,
  });

  usersParam.value = updatedUsersParam;
  ollListsUsers.value = updatedOllListsUsers;

  // получаю список имен пользователей
  usersLogin.value = useUsersLogin({ listsUsers: ollListsUsers });
});



const isEdit = (val) => {

  requests.requestEditTable({
    nameTableBD: TABLES_USERS_BD.info,
    date: {
    "id": val.id,
    "username": val.username,
    "group_id": val.group_id,
    "active_status": val.active_status,
    "created_date": val.created_date,
    "last_updated_date": val.last_updated_date
    },
    type: "edit",
  });
  refreshDate(val.id);
};

const addUser = async (val) => {

  await requests.requestEditTable({
    nameTableBD: TABLES_USERS_BD.info,
    date: [val],
    type: "add",
  });
  // запрашиваю список пользователей заново, так как я не знаю айди который выдаст БД
  usersParam.value = await requests.requestTableData(TABLES_USERS_BD.info);

  const { updatedOllListsUsers, updatedUsersParam } = useAddLdapParamSorts({
    usersParam,
    ollListsUsers,
  });
    usersParam.value = updatedUsersParam;
    ollListsUsers.value = updatedOllListsUsers;
    usersLogin.value = [...usersLogin.value.filter(u => u.login !== val.username)]
};

const delUser = async (id) => {
  await requests.requestDelRecordTable({
    nameTableBD: TABLES_USERS_BD.info,
    IDs: [id],
  });
  // запрашиваю список пользователей заново, так как я не знаю айди который выдаст БД
  const userDel = usersParam.value.find(
    (user) => user.id === id,
  ).samaccountname;
  usersParam.value = usersParam.value.filter((user) => user.id !== id);
  usersLogin.value = [...usersLogin.value, { login: userDel }];
};

const userId = ref();
const accessEditModal = ref(false);

const tablesId = (val) => {
  userId.value = val;
  accessEditModal.value = true;
};

async function refreshDate(saveID) {
  const idUser = storeAuth.getProperty("id");
  if (String(idUser) === String(saveID)) {
    const user = storeAuth.getProperty("user");
    await requests.requestUserDataFilter({
      filterValue: user,
    });
  }
}

const editAccess = async (val) => {
  try {
    if (val.type === "add") {
      await requests.requestEditTable({
        nameTableBD: val.base,
        date: val.value,
        type: "add",
      });
    }

    if (val.type === "del") {
      const IDs = val.value.map((r) => r.id);
      await requests.requestDelRecordTable({
        nameTableBD: val.base,
        IDs,
      });
    }
    if (val.load) {
      accessEditModal.value = false;
    }

    // если ето свой пользователь, обновляю данные в сторе
    await refreshDate(val.value[0].id);
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

<style>
.width {
  width: auto;
}
</style>
