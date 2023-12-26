<template>
  <div class="flex flex-col items-center justify-center">
    <TheLoader v-if="isLoading" />
    <div v-if="groupList" class="max-w-dvw">
      <RecordsPerPageSelector
        v-if="selectedGroupName"
        :model-value="selectedGroupChoice"
        :options="selectedGroupName"
        :description="'Виберіть группу'"
        @update:model-value="editSelectedGroup"
      />

      <PermissionsGroup
        v-if="ollPermissionsOneGroup && allPermissions"
        :permissions="ollPermissionsOneGroup"
        :ollPermissions="allPermissions"
        @edit="editGroupPermission"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRequests } from "@/stores/requests";
import { USERS_BD, ADD } from "@/constants";
import TheLoader from "@/components/TheLoader.vue";
import RecordsPerPageSelector from "@/components/RecordsPerPageSelector.vue";
import PermissionsGroup from "@/components/PermissionsGroup.vue";

const requests = useRequests();

const selectedGroupChoice = ref("Виберіть группу");

const groupsParam = {
  nameBD: USERS_BD,
  nameTableBD: "groups",
};

const permissionsParam = {
  nameBD: USERS_BD,
  nameTableBD: "permissions",
};

const groupPermissionsParam = {
  nameBD: USERS_BD,
  nameTableBD: "group_permissions",
};

const isLoading = ref(false);
const groupList = ref();
const allPermissions = ref();
const selectedGroupName = ref([]);
const groups_permissions = ref();

onMounted(async () => {
  isLoading.value = true;

  // запрашиваю список групп
  groupList.value = await requests.requestTableData(groupsParam);

  // запрашиваю все разрешения
  allPermissions.value = await requests.requestTableData(permissionsParam);

  //запрашиваю все список разрешений для каждой группы
  groups_permissions.value = await requests.requestTableData(
    groupPermissionsParam,
  );

  // отсортировую только имена для селекта
  groupList.value.forEach((g) => {
    selectedGroupName.value.push(g.group_name);
  });

  isLoading.value = false;
});

// разрешения одной группы
const ollPermissionsOneGroup = ref();
const editSelectedGroup = async (val) => {
  selectedGroupChoice.value = val;

  //ищу айди группы
  const group_id = groupList.value.find((g) => g.group_name === val);
  if (group_id && group_id.group_id) {
    //нахожу все айди разрешений для этой группы
    const permissionsOneGroup = groups_permissions.value.filter(
      (g) => g.group_id === group_id.group_id,
    );

    //нахожу все разрешения для этой группы
    ollPermissionsOneGroup.value = allPermissions.value.filter((p) => {
      const coincidence = permissionsOneGroup.find(
        (group_p) => group_p.permission_id === p.permission_id,
      );
      if (coincidence) {
        return p;
      }
    });
  }
};

function sortArr(arr) {
  return arr.sort((a, b) => a.permission_id - b.permission_id);
}

const editGroupPermission = (val) => {
  const linePermission = [
    allPermissions.value.find((p) => p.permission_name_ukr === val.value),
  ];

  if (linePermission) {
    if (val.type === ADD) {
      const addPerm = [...ollPermissionsOneGroup.value, ...linePermission];
      ollPermissionsOneGroup.value = sortArr(addPerm);
    } else {
    ollPermissionsOneGroup.value = ollPermissionsOneGroup.value.filter(item => item.permission_name_ukr !== val.value);
    }
  }
};

// user_info
// user_access
// table_access
// permissions
// groups
// group_permissions
// column_filter
</script>

<script>
export default {
  name: "TheGroupPermissions",
};
</script>
