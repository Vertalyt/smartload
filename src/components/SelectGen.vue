<template>
  <div class="mx-4">
    <select 
    name="select" 
    :value="modelValue"
    class="rounded-md" 
    @input="$emit('update:modelValue', $event.target.value)"
    >
    <option 
      v-if="description"
      :value="description">{{ description }}</option>
      <option 
      v-for="o in options"
      :key="o"
      :value="o">{{ o }}</option>

    </select>
  </div>
</template>

<script setup>


defineEmits(['update:modelValue']);
defineProps({
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
    }
});


</script>

<script>
export default {
  name: "SelectGen",
};
</script>
