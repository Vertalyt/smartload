
<template>
    <div class="flex flex-col gap-3 items-center justify-center m-4">
      <h2 class="w-max font-bold text-lg">Доступні бази</h2>
      <UserSelectedAccess 
      v-if="editAccessBD"
      :item_access="editAccessBD"
      nameParam="bd_name"
      @edit="$emit('BD', $event)"
      />
    </div>
</template>


<script setup>
import { computed } from 'vue'
import UserSelectedAccess from './UserSelectedAccess.vue';
import { itemsAccess } from '@/composables/UsersAccess'


defineEmits({
  BD: Array
});
const props = defineProps({
  bd_access: {
    required: true,
    type: Array
  },
  bd_lists: {
    required: true,
    type: Array
  },
})


const computedBdAccess = computed(() => props.bd_access);
const computedOllBDName = computed(() => props.bd_lists.map(b => b.bd_name));

// добавляю флаг к каждой БД флаг, разрешена ли она
const editAccessBD =  itemsAccess({
  items: computedOllBDName, 
  itemsAccessFilter: computedBdAccess, 
  type:'bd_name',
  immediate: true
})
</script>

<script>
export default {
  name: 'BdCheck',
}
</script>

