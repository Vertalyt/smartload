
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
          <button 
          class="absolute right-2 top-2 rounded-full p-1 bg-red-700 hover:bg-red-800 cursor-pointer"
          @click="delUser(user.ID)"
          >
            <UserDelSVG class="w-5 h-5 text-white"/>
          </button>

          <UserLine title="Логін:" >
            {{ user.username }}
          </UserLine>

          <UserLine title="Емаіл:" >
            {{ user.email }}
          </UserLine>


          <UserLine 
          title="Група:">
            <UsersSelected
            :variable="groupsVariable"
            :user="user"
            :selected="searchNameGroups(usersGroups, user.group_id)"
            @edit="changeGroup"
          />
          </UserLine>


          <UserLine
          title="Статус:">
          <UsersSelected
            :variable="statusUsers"
            :user="user"
            :selected="isSelected(user.active_status)"
            @edit="changeActive"
          />
          </UserLine>


        <UserLine title="Створений:" >
          {{ formatMyDateString(user.created_date) }}
        </UserLine>

        <UserLine v-if="user.last_updated_date" title="Останный запис:">
          {{ formatMyDateString(user.last_updated_date) }}
        </UserLine>

        <UserLine title="Дозволи таблиць:" >
          <Permissions_BD_Table />
        </UserLine>


      </li>
        </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatMyDateString, statusChange, searchIdGroups, searchNameGroups } from "@/functions";
import UsersSelected from "@/components/users/UsersSelected.vue";
import { statusUsers } from '@/constants'
import Permissions_BD_Table from '@/components/users/Permissions_BD_Table.vue'
import UserLine from '@/components/users/UserLine.vue'
import UserDelSVG from "@/assets/img/svg/UserDelSVG.vue";

const emit = defineEmits({
  edit: Array,
  del: String
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


function isSelected(status) {
  return status === '1' ? statusUsers[0] : statusUsers[1]
}

// Преобразование в нужный формат БД
function formattedDate(param) {
  return new Date(param);
}


function requestsEdit(arrEdit) {
  const userEdit = arrEdit
  userEdit.created_date = formattedDate(userEdit.created_date)
  userEdit.last_updated_date = new Date().toISOString();
  return userEdit

}


const changeActive = ({ user, change }) => {

  const userEdit = user;
  const active = statusChange(change)
  userEdit.active_status = active;
  const date = requestsEdit(userEdit)
  emit('edit', date)
};


const changeGroup = ({ user, change }) => {
  const userEdit = user;
  userEdit.group_id = searchIdGroups(props.usersGroups, change);
  const date = requestsEdit(userEdit)
  emit('edit', date)
};


const delUser = (id) => {
  emit('del', id)
}

</script>

<script>
export default {
  name: 'TheUsersInfo',
}
</script>