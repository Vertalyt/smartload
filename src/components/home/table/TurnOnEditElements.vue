
<template>
  <div 
  v-if="isAccess('allowed_group_editor')"
  class="flex items-center justify-center relative">

    <!-- <button
        class="rounded-full bg-gray-500 p-1 mr-2 hover:bg-gray-400"
        @click="isState('isEdit')"
      >
      <PensilSVG  class="w-5 h-5 text-gray-800"/>
    </button>

    <button
    class="rounded-full bg-red-700 p-1 mr-2 hover:bg-red-800"
    @click="isState('isDel')"
      >
      <DelRecordSVG  
      class="w-5 h-5 text-gray-800"/>
    </button>

    <button
    v-if="isAccess('allowed_group')"
      class="rounded-full bg-red-700 ml-4 p-1 mr-2 hover:bg-red-800"
        @click="isState('isDelColumn')"
      >
    <DelColumnSVG class="w-5 h-5" />
    </button>

    <TheAddCol @column="$emit('column', $event)"
      /> -->

      <TheTooltip 
    content="Редагувати"
    :isSHow="isSHowEdit"
    >
      <button
        class="rounded-full bg-gray-500 p-1 mr-2 hover:bg-gray-400"
        @click="isState('isEdit')"
        @mouseover="isSHowEdit = true"
        @mouseleave="isSHowEdit = false"
      >
      <PensilSVG  class="w-5 h-5 text-gray-800"/>
    </button>
    </TheTooltip>


    <TheTooltip 
    content="Видалити"
    :isSHow="isSHowDel"
    >

    <button
    class="rounded-full bg-red-700 p-1 mr-2 hover:bg-red-800"
    @click="isState('isDel')"
    @mouseover="isSHowDel = true"
    @mouseleave="isSHowDel = false"
      >
      <DelRecordSVG  
      class="w-5 h-5 text-gray-800"/>
    </button>

  </TheTooltip>



  <TheTooltip 
    content="Видалити стовбець"
    :isSHow="isSHowColumnDel"
    >
    <button
    v-if="isAccess('allowed_group')"
      class="rounded-full bg-red-700 ml-4 p-1 mr-2 hover:bg-red-800"
        @click="isState('isDelColumn')"
        @mouseover="isSHowColumnDel = true"
        @mouseleave="isSHowColumnDel = false"
      >
    <DelColumnSVG class="w-5 h-5" />
    </button>
  </TheTooltip>


    <TheAddCol 
    @column="$emit('column', $event, isSHowAddColumn = false)" 
    @mouseover="isSHowAddColumn = true"
    @mouseleave="isSHowAddColumn = false"
         />

  </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import PensilSVG from '@/assets/img/svg/PensilSVG.vue';
import DelRecordSVG from '@/assets/img/svg/DelRecordSVG.vue';
import DelColumnSVG from '@/assets/img/svg/DelColumnSVG.vue';


import TheAddCol from "./TheAddCol.vue";
import TheTooltip from '@/components/TheTooltip.vue'

import { useAuthStore } from "@/stores/auth";
import { allowed_group_editor, allowed_group } from '@/constants'

const emit = defineEmits({
  column: Object,
  turn: String,
});

const props = defineProps({
  resetValue: {
    required: true,
    type: Boolean
  }
})

const storeAuth = useAuthStore()
const groupUser = computed( () => storeAuth.getProperty('group_id') ) 


function isAccess(key) {
  const groupType = key === 'allowed_group_editor' ? allowed_group_editor : allowed_group;

  if(!groupType.group.includes(Number(groupUser.value))) {
      return false
        } else {return true}
}


const stateTurn = ref('empty')
const isState = (val) => {
  if(stateTurn.value === val) {
    stateTurn.value = 'empty'
  } else {
    stateTurn.value = val
  }
  emit('turn', stateTurn.value)

}


const computedReset = computed( () => props.resetValue )
watch(computedReset, val => {
  if(val) {
    stateTurn.value = 'empty'
  }
})

const isSHowEdit = ref(false)
const isSHowDel = ref(false)
const isSHowColumnDel = ref(false)
const isSHowAddColumn = ref(false)

</script>

<script>
export default {
  name: 'TurnOnEditElements',
}
</script>

