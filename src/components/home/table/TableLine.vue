<template>
  <th
    v-for="(col, key, index) in line"
    :key="col + index + key"
    class="py-3 border border-gray-500 relative"
    :class="isId(key)"
  >
    <div class="flex items-center justify-between gap-2">
      <EditButtonBlock 
        :nameLine="key"
        :lineId="line.id"
        :isTurnEl="isTurnEl"
        @edit="$emit('edit', $event)"
        @del="$emit('del', $event)"
        />

      <span class="px-3 text-center">{{ col }}</span> 

    </div>
  </th>


</template>

<script setup>
import EditButtonBlock from '@/components/home/table/EditButtonBlock.vue'

defineEmits({
  edit: String,
  del: String
});
defineProps({
  line: {
    required: true,
    type: Object,
  },
  isTurnEl: {
    required: false,
    type: String,
  },
});


const isId = (col) => {
  return col === "id" ? "w-[80px]" : "min-w-[20ch]";
};



</script>

<script>
export default {
  name: "TableLine",
};
</script>
