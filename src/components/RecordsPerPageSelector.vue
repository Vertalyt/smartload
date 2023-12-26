<template>
  <div class="mx-4">
    <select 
    name="select" 
    :value="modelValue"
    class="rounded-md"
    :class="{ 'w-40' : isSmall }"
    @input="$emit('update:modelValue', $event.target.value)"
    >
    <option 
      v-if="description"
      :value="description">{{ description }}</option>
      <option 
      v-for="o in computedOptions"
      :key="o"
      :value="o">{{ o }}</option>

    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue';


defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue :{
        required: true,
        type: [String, Number]
    },
    options: {
        required: true,
        type: Array
    },
    description: {
      required: false,
      type: String
    },
    isSmall:{
      required: false,
      type: Boolean
    }
});

const computedOptions = computed( () => props.options )


</script>

<script>
export default {
  name: "RecordsPerPageSelector",
};
</script>
