<template>
  <form
    action="#"
    class="wrap flex flex-col sm:flex-row flex-wrap items-center justify-evenly lg:justify-center gap-2 sm:gap-5 py-3 max-w-[1400px] pl-3"
    @submit.prevent="addUser"
  >

    <TheFormElement title="Логін" >

    <div class="relative mt-1 rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 flex items-center">

      </div>
      <input
        v-model="inputForm"
        type="text"
        id="name"
        name="name"
        required
        class="h-14 z-20 rounded-t-md border-gray-300 text-sm focus:border-green-500 focus:ring-green-500 w-52"
        placeholder="John_Doe"
      />
        <div>
          
          <button 
          @click.prevent="showLists = !showLists"
          class="absolute top-1 right-1  flex flex-col items-center justify-center gap-2 border h-12 px-2 hover:bg-gray-200 cursor-pointer rounded-md">
                  <UserFormSVG
                  class="h-5 w-5 text-gray-400" />
                <span class="arrow"></span>
          </button>


        </div>
        <TheListsUsersLdap 
        v-if="showLists"
        :usersLogin="sortsUserLogin"
        @user="findUser"
        />
    </div>
    </TheFormElement>

    <TheFormElement title="Статус"  >
    <div class="relative rounded-md shadow-sm">
      <div>
        <input
          type="radio"
          id="active"
          v-model="radio"
          name="radio"
          value="1"
        />
        <label for="active">{{ statusUsers[0] }}</label>
      </div>

      <div>
        <input
          type="radio"
          id="disabled"
          v-model="radio"
          name="radio"
          value="0"
        />
        <label for="disabled">{{ statusUsers[1] }}</label>
      </div>
    </div>
    </TheFormElement>

    <TheFormElement title="Група">

      <RecordsPerPageSelector
        class="mx-0"
        :options="variable"
        :modelValue="groupUser"
        @update:model-value="changeGroup"
        key="group"
      />

    </TheFormElement>

    
    <!-- <div class="mb-4 flex items-end justify-center lg:h-20"> -->
      <TheFormElement>
        <SubmitButton nameBtn="Submit" color="green" class="flex items-center" />
      </TheFormElement>

    <!-- </div> -->
  </form>
</template>

<script setup>
import SubmitButton from "@/components/SubmitButton.vue";
import UserFormSVG from "@/assets/img/svg/UserFormSVG.vue";
import RecordsPerPageSelector from "@/components/RecordsPerPageSelector.vue";
import { ref, watch, computed } from "vue";
import { statusUsers } from "@/constants";
import { searchIdGroups } from "@/functions";
import TheFormElement from "@/components/home/table/TheFormElement.vue";
import TheListsUsersLdap from "./TheListsUsersLdap.vue";



const emit = defineEmits({
  add: Object,
});
const props = defineProps({
  variable: {
    required: true,
    type: Array,
  },
  usersGroups: {
    required: true,
    type: Array,
  },
  usersLogin: {
    required: true,
    type: Array,
  },
});

const sortsUserLogin = ref()
const sortsUserLoginComputed = computed(() =>  props.usersLogin)

watch(sortsUserLoginComputed, val => {
  sortsUserLogin.value = val
}, { immediate: true })


const radio = ref("0");
const inputForm = ref()


// Запрещаем вывод кириллицы
const allowedCharactersRegex = /^[a-zA-Z0-9._@-\s]+$/;

watch(inputForm, (newValue, oldValue) => {
  if (!allowedCharactersRegex.test(newValue)) {
    if(newValue === '') {
      inputForm.value = newValue
    } else {
    // Ввод содержит недопустимые символы
    inputForm.value = oldValue;
    }

  } else {
    // Ввод допустим
    inputForm.value = newValue;
  }
});



watch(inputForm, (val) => {
  if (val.length > 1) {
    const lowerVal = val.toLowerCase(); // Привести val к нижнему регистру
    sortsUserLogin.value = props.usersLogin.filter(user => {
      // Проверка наличия lowerVal в lowercased user.login
      return user.login.toLowerCase().includes(lowerVal);
    });
  } else {
    sortsUserLogin.value = props.usersLogin
  }
});



function resetForm() {
  radio.value = "disabled";
  groupUser.value = "Reader";
  inputForm.value = "";
}

const findUser = (val) => {
  inputForm.value = val
  showLists.value = false
}

const addUser = () => {
  const values = {
    username: inputForm.value,
    group_id: searchIdGroups(props.usersGroups, groupUser.value),
    active_status: radio.value,
  };
  emit("add", values);

  resetForm();
};

const groupUser = ref("Reader");
const changeGroup = (val) => {
  groupUser.value = val;
};

const showLists = ref(false)

// дабавляю к ширине ширину селекта



</script>

<script>
export default {
  name: "TheAddForm",
};
</script>


<style scoped>
.arrow {
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 6px 0 6px;
  border-color: #555 transparent transparent transparent;
  pointer-events: none; /* чтобы стрелка не мешала кликам на селекте */
}
</style>