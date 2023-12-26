
<template>
                <th 
                v-for="(col, key, index) in cols"
                :key="col + index + key"
                scope="col" 
                class="px-6 py-3 min-w-min"
                :class="isId(key)"
                >
                    {{ col }}
                </th>
</template>


<script setup>
defineEmits({});
defineProps({
  thead: {
        required: false,
        type: Boolean
    },
  cols: {
        required: true,
        type: [Array, Object]
    }
})

  const isId = (col) =>  {
    return  col === 'ID' ? 'max-w-[10px]' : 'min-w-[20ch]'
  }

</script>

<script>
export default {
  name: 'TableLine',
}
</script>

