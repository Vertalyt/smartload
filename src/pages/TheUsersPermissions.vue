<template>
  <div class="flex flex-col items-center justify-center">
    <TheLoader v-if="isLoading" />
  </div>

  <ModalWrapper 
  class="width"
  v-if="accessEditModal" @close="accessEditModal = false">
    <EditAccessUser
      v-if="userId"
      :id="userId"
      @edit="editAccess"
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
    @tables="tablesId"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRequests } from "@/stores/requests";
import { useAuthStore } from "@/stores/auth";
import { USERS, GROUPS_PARAM } from "@/constants";
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
  refreshDate(val.id)
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
    IDs: [id],
  });
  // запрашиваю список пользователей заново, так как я не знаю айди который выдаст БД
  usersParam.value = usersParam.value.filter((user) => user.id !== id);
};


const userId = ref()
const accessEditModal = ref(false);

const tablesId = (val) => {
  userId.value = val;
  accessEditModal.value = true
}




const storeAuth = useAuthStore();

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
        nameBD: USERS.nameBD,
        nameTableBD: val.base,
        date: val.value,
        type: "add",
      });
    }

    if (val.type === "del") {
      const IDs = val.value.map(r => r.id)
      await requests.requestDelRecordTable({
        nameBD: USERS.nameBD,
        nameTableBD: val.base,
        IDs,
      });
    }
    if(val.load) {
    accessEditModal.value = false;
    }


    // если ето свой пользователь, обновляю данные в сторе
    await refreshDate(val.value[0].user_id);

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