<template>
  <th
    v-for="c in line"
    :key="c.name_ua_cols"
    class="py-3 border border-gray-500 relative"

  >
    <div class="flex items-center justify-between gap-2">
      <SearchIdTable 
      v-if="c.name_ua_cols === 'id'"
      :reset="resetSearch"
      @searchId="$emit('search-id', $event)"
      />

      <button
        v-if="c.name_ua_cols === 'id'"
        class="focus-visible:none w-[1px]"
        aria-label="one"
        id="sendRef"
      >
      </button>
      
      <div
      v-if="c.name_ua_cols !== 'id'"
      >
      <span class="px-3 text-center">{{ c.name_ua_cols }}</span> 

      <button
        v-if="isTurnEl === 'isDelColumn'"
        class="rounded-full bg-red-800 p-1 mr-2 hover:bg-red-900"
        @click="$emit('del-column', c.key_Cols)"
      >
      <DelColumnSVG  class="w-5 h-5 text-slate-100"/>
      </button>
      </div>

    </div>
  </th>


</template>

<script setup>
import DelColumnSVG from '@/assets/img/svg/DelColumnSVG.vue';
import SearchIdTable from './SearchIdTable.vue';

defineProps({
  line: {
    required: true,
    type: Object,
  },
  isTurnEl: {
    required: true,
    type: String,
  },
  resetSearch: {
    required: true,
    type: Boolean,
  }
});

defineEmits({
  'del-column': String,
  'search-id': [Number, String]
})

</script>

<script>
export default {
  name: "TableLineNameCols",
};
</script>
