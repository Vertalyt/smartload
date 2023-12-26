
<template>
        <ul>
          <li 
        class="mb-2 text-md"
        v-for="p in permissions" :key="p.permission_id">
          {{ p.permission_name_ukr }}
        </li>
        </ul>
</template>


<script setup>
defineEmits({});
defineProps({
  permissions: {
    required: true,
    type: Array,
  },
})
</script>

<script>
export default {
  name: 'ListPermission',
}
</script>

