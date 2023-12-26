<template>
  <div class="flex flex-col mt-5 p-3 max-w-dvw items-center justify-center gap-3 overflow-hidden rounded shadow-lg bg-gray-400">
    <div class="px-6">
      <div class="text-xl font-bold">Права групи</div>
    </div>

      <div class="px-6 pb-2">

        <ListPermission :permissions="permissions" />


      <div class="flex flex-col gap-3 grow-1">
      
        <EditGroupPermissions 
        v-if="selectedAddPermissionsName.length > 0"
        :ollPermissions="ollPermissions"
        :permissions="permissions"
        :permissionsName="selectedAddPermissionsName"
        type="add"
        colorBtn="blue"
        @edit="$emit('edit', $event)"
        />

        <EditGroupPermissions 
        v-if="selectedDelPermissionsName.length > 0"
        :ollPermissions="ollPermissions"
        :permissions="permissions"
        :permissionsName="selectedDelPermissionsName"
        type="remove"
        colorBtn="red"
        @edit="$emit('edit', $event)"
        />

    </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ListPermission from '@/components/groups/ListPermission.vue'
import EditGroupPermissions from '@/components/groups/EditGroupPermissions.vue'


defineEmits({
  edit: Object
})

const props = defineProps({
  permissions: {
    required: true,
    type: Array,
  },
  ollPermissions: {
    required: true,
    type: Array,
  }, 
});


const selectedAddPermissionsName = ref([])
const selectedDelPermissionsName = ref([])

// ищу и убираю с списка уже доступные права и selectedDelPermissionsName 
// и selectedAddPermissionsName уже те что есть
const computedPermissions = computed(() => props.permissions )

watch(computedPermissions, val => {
  selectedAddPermissionsName.value.length = 0;
  selectedDelPermissionsName.value.length = 0;
  props.ollPermissions.forEach(p => {
   const perm = val.find(i => i.permission_id === p.permission_id  )
   if(perm) {
    selectedDelPermissionsName.value.push(p.permission_name_ukr)
  } else {
    selectedAddPermissionsName.value.push(p.permission_name_ukr)
  } 
})
}, { immediate: true })

</script>

<script>
export default {
  name: "PermissionsGroup",
};
</script>

<style scoped>
.smallSelect > div > select{
width: 100px;
}
</style>