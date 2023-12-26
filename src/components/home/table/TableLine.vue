<template>
  <th
    v-for="(col, key, index) in line"
    :key="col + index + key"
    class="py-3 border border-gray-500 max-w-48"
    :class="isId(key)"
  >
    <div class="flex items-center justify-between gap-2">
      <span class="px-3">{{ col }}</span> 


      <button
        v-if="thead && col === 'ID'"
        class="rounded-full focus-visible:none"
        aria-label="one"
        id="sendRef"
      >
    </button>


      <button
        v-if="!thead && key !== 'ID'"
        class="rounded-full bg-gray-500 p-1 hover:bg-gray-400"
        @click="onSubmit(line.ID)"
      >
      <PensilSVG  class="w-5 h-5 text-gray-800"/>
    </button>

    </div>
  </th>


</template>

<script setup>
import PensilSVG from '@/assets/img/svg/PensilSVG.vue';

const emit = defineEmits({
  edit: Number,
});
defineProps({
  thead: {
    required: false,
    type: Boolean,
  },
  line: {
    required: true,
    type: [Array, Object],
  },
});


const isId = (col) => {
  return col === "ID" ? "max-w-[10px]" : "min-w-[20ch]";
};

const onSubmit = (ID) => {
  emit("edit", ID);
};
</script>

<script>
export default {
  name: "TableLine",
};
</script>
