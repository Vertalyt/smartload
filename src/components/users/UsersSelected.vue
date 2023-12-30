
<template>
                <select
                  name="isActive"
                  class="rounded-md"
                  @input="isChange"
                >
                  <option 
                  v-for="o in props.variable" 
                  :key="o" 
                  :value="o"
                  :selected="isActiveStatus(o)"
                  >
                    {{ o }}
                  </option>
                </select>
</template>


<script setup>

const emit = defineEmits({
  edit: Object
});
const props = defineProps({
  user: {
    required: true,
    type: Object
  },
  variable: {
    required: true,
    type: Array
  },
  selected: {
    required: true,
    type: String
  },
})


function isActiveStatus (active) {
  return props.selected == active
};



const isChange = (event) => {
  emit('edit', { user:props.user, change: event.target.value })
}

</script>

<script>
export default {
  name: 'UsersSelected',
}
</script>

