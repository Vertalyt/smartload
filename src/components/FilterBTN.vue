
<template>
      <div class="relative">
        <span
          v-if="isActive && count"
          class="absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-xl border border-blue-500 bg-blue-400 text-white"
          >{{ count }}</span
        >
        <button
          @click.stop="isClick"
          class="rounded-2xl border-blue-200 px-4 py-2 text-xl font-semibold text-gray-700 shadow-lg transition duration-150 ease-in-out hover:bg-blue-300 hover:text-white hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-0 focus:ring-blue-300 focus:ring-offset-1"
          :class="activeClass"
          >
          {{ nameItemComputed }}
        </button>
      </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits({
  active: Object,
});

const props = defineProps({
  nameItem: {
    required: true,
    type: Object,
  },
  count:{
    required: false,
    type: Number,
  },
  ollActively: {
    required: true,
    type: [Boolean, null],
  }
})

const isActive = ref(false)
const isOllActively = computed( () => props.ollActively )

const nameItemComputed = computed( () => props.nameItem.name_ua_cols )
watch(isOllActively, val => {
  val ? isActive.value = true : isActive.value = false 
}, { immediate: true })

const isClick = () => {
  isActive.value = !isActive.value
  emit('active', {activeBtn: isActive.value, name: props.nameItem.key_Cols } )
}

const activeClass = computed( () => isActive.value ? 'bg-blue-300' : 'bg-blue-100') 
</script>

<script>
export default {
  name: 'FilterBTN',
}
</script>

