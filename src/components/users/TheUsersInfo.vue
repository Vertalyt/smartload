
<template>
  <div class="flex flex-col gap-3 rounded bg-gray-400/60 shadow-lg"
  >
    <div class="mx-auto mt-4 text-xl font-bold">Користувачі</div>
        <ul class="flex flex-wrap justify-center items-stretch">
      <li
        v-for="user in computedUsers"
        :key="user.username"
        class="relative min-w-80 m-3 flex flex-col items-center gap-3 rounded-md border-2 border-gray-300 bg-gray-200/50 py-2 lg:p-3"
      >
          <TheUserInfo 
          :user="user"
          :usersGroups="usersGroups"
          :usersParam="usersParam"
          :groupsVariable="groupsVariable"
          @edit="$emit('edit', $event)"
          @del="$emit('del', $event)"
          @tables="$emit('tables', $event)"
          />
      </li>
        </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";
import TheUserInfo from "./TheUserInfo.vue";

defineEmits({
  edit: Array,
  del: String,
  tables: String
});
const props = defineProps({
  usersGroups: {
    required: true,
    type: Array
   },
  usersParam: {
    required: true,
    type: Array
   },
   groupsVariable:{
    required: true,
    type: Array
   },
})

const computedUsers = computed( () => props.usersParam )


</script>

<script>
export default {
  name: 'TheUsersInfo',
}
</script>