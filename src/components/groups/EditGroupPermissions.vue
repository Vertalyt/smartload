
<template>
        <div 

        class="flex flex-col lg:flex-row items-center justify-between wrap gap-5 mt-4 p-2 pl-4 border border-gray-300 rounded-md" >
            <span class="font-bold">{{ type }} права: </span>

            <SubmitButton
            :nameBtn="type"
            :color="colorBtn"
            @submit="editPermission(type)"
            class="mr-2"
            />

              <RecordsPerPageSelector 
              :model-value="selectedPermissionsChoice"
              :options="computedNameSelect"
              :description="'Виберіть дозвіл'"
              :isSmall="mediaSmall()"
              @update:model-value="editPermissionsGroup"
              />
      </div>
</template>


<script setup>
import SubmitButton from '@/components/SubmitButton.vue';
import RecordsPerPageSelector from '@/components/RecordsPerPageSelector.vue'
import { ref, computed } from 'vue';
import { ADD, REMOVE } from '@/constants'


const emit = defineEmits({
  edit: Object
});
const props = defineProps({
ollPermissions: {
    required: true,
    type: Array,
  },
 permissions: {
    required: true,
    type: Array,
  },
  type: {
    required: true,
    type: String,
  },
  colorBtn: {
    required: true,
    type: String,
  },
  permissionsName: {
    required: true,
    type: Array,
  },
})

const computedNameSelect = computed( () => props.permissionsName )  


const type = props.type === 'add' ? ADD : REMOVE

const selectedPermissionsChoice = ref('Виберіть дозвіл')

const editPermission = (val) => {

  emit('edit', { type: val, value: selectedPermissionsChoice.value })
  selectedPermissionsChoice.value = 'Виберіть дозвіл'
}

const editPermissionsGroup = (val) => {
  selectedPermissionsChoice.value = val
}

const availableScreenWidth = window.innerWidth
const mediaSmall = () => {
  return availableScreenWidth < 600 ? true : false
}



</script>

<script>
export default {
  name: 'EditGroupPermissions',
}
</script>

