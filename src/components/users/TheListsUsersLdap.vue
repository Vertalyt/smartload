
<template>
  <div>
    <ul 
      class="z-10 max-h-60 overflow-y-auto overflow-x-hidden absolute left-0 top-14 border-gray-300"
      >
      <li v-if="!usersLogin.length"
      class="flex gap-4 items-center justify-center bg-gray-50 cursor-not-allowed hover:bg-gray-200 w-52 pl-2 rounded-b-md"
      >
      <span class="italic text-gray-400">Нема результату.</span>
      </li>
      <li 
      v-for="o in usersLogin"
      class="flex gap-4 items-center bg-gray-50 border cursor-pointer hover:bg-gray-200 w-48 pl-5"
      :key="o.login"
      :value="o.login"
      @click="$emit('user', o.login)"
      >
        <span class="font-semibold">
          {{ o.login }}
        </span>

    </li>
      </ul>
  </div>
</template>


<script setup>

defineEmits({
  user: String
});
defineProps({
  usersLogin: {
    required: true,
    type: Array,
  },
})


</script>

<script>
export default {
  name: 'TheListsUsersLdap',
}
</script>

