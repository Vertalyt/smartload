
<template>
    <button 
          class="absolute right-2 top-2 rounded-full p-1 bg-red-700 hover:bg-red-800 cursor-pointer"
          @click="delUser(user.id)"
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
          <Permissions_BD_Table 
          @edit="$emit('tables', user.id)"
          />
        </UserLine>

</template>


<script setup>
import Permissions_BD_Table from '@/components/users/Permissions_BD_Table.vue'
import UserLine from '@/components/users/UserLine.vue'
import UserDelSVG from "@/assets/img/svg/UserDelSVG.vue";
import UsersSelected from "@/components/users/UsersSelected.vue";
import { formatMyDateString, searchNameGroups } from "@/functions";
import { statusUsers } from '@/constants'
import { statusChange, searchIdGroups } from "@/functions";


const emit = defineEmits({
  edit: Array,
  del: String,
  tables: String
});
const props = defineProps({
  user: {
    required: true,
    type: Object
   },
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

const delUser = (id) => {
  emit('del', id)
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


</script>

<script>
export default {
  name: 'TheUserInfo',
}
</script>

