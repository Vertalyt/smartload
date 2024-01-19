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

    </div>
  </th>


</template>

<script setup>

defineProps({
  line: {
    required: true,
    type: Object,
  },
});


</script>

<script>
export default {
  name: "TableLineNameCols",
};
</script>
