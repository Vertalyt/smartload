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
        v-if="ollPermissionsOneGroup && accessPermissionsOneGroup"
        :permissions="accessPermissionsOneGroup"
        :group="selectedGroupChoice"
        :ollPermissions="ollPermissionsOneGroup"
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
import { useAccessPage } from '@/composables/useAccess'


const requests = useRequests();

const CHOICE_SELECT = 'Виберіть группу'
const selectedGroupChoice = ref(CHOICE_SELECT);

const isLoading = ref(false);
const groupList = ref();
const allPermissions = ref();
const selectedGroupName = ref([]);
const groups_permissions = ref();


onMounted(async () => {
  useAccessPage('group')

  isLoading.value = true;

  // запрашиваю список групп
  groupList.value = await requests.requestTableData(GROUPS_PARAM);

  // убираю группу root со списка. Ее нельзя редактировать
  // groupList.value = ollGroupList.filter( g=> g.group_name !== 'root')
  // запрашиваю все разрешения
  allPermissions.value = await requests.requestTableData(PERMISSIONS_PARAM);

  //запрашиваю веcь список разрешений для всех групп
  groups_permissions.value = await requests.requestTableData(
    GROUP_PERMISSIONS_PARAM,
  );

  // отсортировую только имена для селекта
  groupList.value.forEach((g) => {
    selectedGroupName.value.push(g.group_name);
  });

  isLoading.value = false;
});

// разрешения одной группы с учетом allowed
const ollPermissionsOneGroup = ref();
const accessPermissionsOneGroup = ref()
// нахожу все разрешения для искомой группы для передачи в селект

const editSelectedGroup = async (val) => {
  if(val !== CHOICE_SELECT) {
    const { allPermissionsSortName, accessPermissionsName } = editGroup({
    groupList,
    groupName: val,
    groups_permissions,
    allPermissions,
  });
  if (allPermissionsSortName) {
    ollPermissionsOneGroup.value = allPermissionsSortName;   
    accessPermissionsOneGroup.value = accessPermissionsName;
  }
  selectedGroupChoice.value = val;
  } else {
    accessPermissionsOneGroup.value = null;
    ollPermissionsOneGroup.value = null
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

  // нахожу айди и имя группы пользователя
  const group = groupList.value.find(
    (g) => g.group_name === selectedGroupChoice.value,
  );

   //  строка с данным разрешением
  const linePermission = allPermissions.value.find(
    (p) => p.permission_name_ukr === val.value,
  );

  const linePermissionsID = foundIdRecord(group, linePermission)
  if (linePermissionsID) {
      const edit = {
        id: linePermissionsID,
        isEnable: val.type === ADD ? 1 : 0
      }
      

      try {
        // добавляю запись 
        await requests.requestEditTable({
            nameBD: USERS_BD,
            nameTableBD: GROUP_PERMISSIONS_PARAM.nameTableBD,
            date: edit,
            type : 'edit'
          })
          let addPerm
          if(val.type === ADD) {
            addPerm = [...accessPermissionsOneGroup.value, ...[linePermission]];
          } else {
            addPerm = accessPermissionsOneGroup.value.filter(p => p.permission_id !== linePermission.permission_id)
          }
      // сортирую по айди
      accessPermissionsOneGroup.value = sortArr(addPerm);
      } catch (error) {
                  /* empty */
      }

  }
};
</script>

<script>
export default {
  name: "TheGroupPermissions",
};
</script>
