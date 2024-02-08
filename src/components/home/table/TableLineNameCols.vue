<template>
  <th
    v-for="c in line"
    :key="c.name_ua_cols"
    class="py-3 border border-gray-500 max-w-48 relative"

  >
    <div class="flex items-center justify-between gap-2">
      <button
        v-if="c.name_ua_cols === 'id'"
        class="focus-visible:none w-[1px]"
        aria-label="one"
        id="sendRef"
      >
      </button>
      
      <span class="px-3 text-center">{{ c.name_ua_cols }}</span> 

      <button
        v-if="isTurnEl === 'isDelColumn' && c.name_ua_cols !== 'id'"
        class="rounded-full bg-red-800 p-1 mr-2 hover:bg-red-900"
        @click="$emit('del-column', c.key_Cols)"
      >
      <DelColumnSVG  class="w-5 h-5 text-slate-100"/>
    </button>



    </div>
  </th>


</template>

<script setup>
import DelColumnSVG from '@/assets/img/svg/DelColumnSVG.vue';


defineProps({
  line: {
    required: true,
    type: Object,
  },
  isTurnEl: {
    required: true,
    type: String,
  },
});

defineEmits({
  'del-column': String
})

</script>

<script>
export default {
  name: "TableLineNameCols",
};
</script>
