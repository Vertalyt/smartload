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
import {
  ADD,
  GROUPS_PARAM,
  PERMISSIONS_PARAM,
  GROUP_PERMISSIONS_PARAM,
  USERS_BD,
} from "@/constants";
import TheLoader from "@/components/TheLoader.vue";
import RecordsPerPageSelector from "@/components/RecordsPerPageSelector.vue";
import PermissionsGroup from "@/components/PermissionsGroup.vue";
import { editGroup, sortArr } from "@/functions";

const requests = useRequests();

const selectedGroupChoice = ref("Виберіть группу");

const isLoading = ref(false);
const groupList = ref();
const allPermissions = ref();
const selectedGroupName = ref([]);
const groups_permissions = ref();

onMounted(async () => {
  isLoading.value = true;

  // запрашиваю список групп
  groupList.value = await requests.requestTableData(GROUPS_PARAM);

  // запрашиваю все разрешения
  allPermissions.value = await requests.requestTableData(PERMISSIONS_PARAM);

  //запрашиваю веcь список разрешений для каждой группы
  groups_permissions.value = await requests.requestTableData(
    GROUP_PERMISSIONS_PARAM,
  );

  // отсортировую только имена для селекта
  groupList.value.forEach((g) => {
    selectedGroupName.value.push(g.group_name);
  });

  isLoading.value = false;
});

// разрешения одной группы
const ollPermissionsOneGroup = ref();

// нахожу все разрешения для искомой группы для передачи в селект
const editSelectedGroup = async (val) => {
  selectedGroupChoice.value = val;

  const result = editGroup({
    groupList,
    groupName: val,
    groups_permissions,
    allPermissions,
  });

  if (result) {
    ollPermissionsOneGroup.value = result;
  }
};

function foundIdRecord(group, linePermission) {
 return groups_permissions.value.find(
        (g) =>
          g.group_id === group.group_id &&
          g.permission_id === linePermission.permission_id,
      )?.id;
}


// вношу правки (добавление/удаление) разрешений для группы
const editGroupPermission = async (val) => {
  const group = groupList.value.find(
    (g) => g.group_name === selectedGroupChoice.value,
  );
  //  строка с данным разрешением
  const linePermission = allPermissions.value.find(
    (p) => p.permission_name_ukr === val.value,
  );

  if (linePermission) {
    if (val.type === ADD) {
      const add = { group_id: group.group_id, permission_id: linePermission.permission_id}
      try {
        // добавляю запись 
        await requests.requestEditTable({
            nameBD: USERS_BD,
            nameTableBD: GROUP_PERMISSIONS_PARAM.nameTableBD,
            date: [add],
            type : 'add'
          })

      const addPerm = [...ollPermissionsOneGroup.value, ...[linePermission]];
      ollPermissionsOneGroup.value = sortArr(addPerm);
      } catch (error) {
                  /* empty */
      }

    } else {
      const linePermissionsDel = foundIdRecord(group, linePermission)
      if (linePermissionsDel) {
        try {
          await requests.requestDelRecordTable({
            nameBD: USERS_BD,
            nameTableBD: GROUP_PERMISSIONS_PARAM.nameTableBD,
            IDs: [linePermissionsDel],
          });
          ollPermissionsOneGroup.value = ollPermissionsOneGroup.value.filter(
        (item) => item.permission_name_ukr !== val.value );
        } catch (error) {
          /* empty */
        }
      }
    }
  }
};
</script>

<script>
export default {
  name: "TheGroupPermissions",
};
</script>
