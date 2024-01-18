
<template>
            <div class="relative flex items-center">
              <button 
              v-if="isCol"
              class="absolute left-[10.8rem] -top-4 z-20 rounded-full bg-gray-400 hover:bg-gray-300"
              @click="isClose"
              >
                <AbortSVG  class="h-8 w-8 bg-red-600 rounded-full text-white hover:bg-red-700"/>
              </button>


              <input
              v-if="isCol"
              v-model.trim="modelInputAddCol"
              placeholder="Назва стовпця"
              maxlength="40"
              class="absolute left-0 z-10 rounded-xl bg-gray-200 hover:bg-gray-300 p-1.5 text-center w-52 text-gray-600 font-semibold"
              >


              <button 
              class="absolute left-1 -top-4 z-20 rounded-full p-1"
              :class="{
                          'bg-gray-400 hover:bg-gray-500': !isCol,
                          'bg-green-500 hover:bg-green-600': isCol
                      }"
              @click="addCol"
              >
                <PlusSVG  class="h-6 w-6"/>
              </button>
            </div>
</template>


<script setup>
import { ref, watch } from "vue";
import PlusSVG from "@/assets/img/svg/PlusSVG.vue";
import AbortSVG from "@/assets/img/svg/AbortSVG.vue";
import { translit } from '@/functions'



const emit = defineEmits({
  column: Object
});



const isCol = ref(false)

const modelInputAddCol = ref();

// разрешаю только латиницу, цифри и нижнее подчеркивание. Первый символ обязательно буква латиницы
const regex = /^[a-zA-Zа-яА-ЯҐґЄєІіЇїЙйЬьЮюЯя0-9_][a-zA-Zа-яА-ЯҐґЄєІіЇїЙйЬьЮюЯя0-9_]*$/;
// const regex = /^[a-zA-Z][_a-zA-Z0-9]*$/; 
watch(modelInputAddCol, (newValue, oldValue) => {
  if (!regex.test(newValue)) {
    newValue === '' 
    ? modelInputAddCol.value = newValue
    : modelInputAddCol.value = oldValue;
  }
});



const isClose = () => {
  modelInputAddCol.value = null
  isCol.value = false
}

const addCol = () => {
  if(isCol.value) {
    if(modelInputAddCol.value) {
      const date = new Date()
      const timestamp = date.getTime();
      const key = translit(modelInputAddCol.value)
      const nameCol = {
        [`_${key}_${timestamp}`] : `${modelInputAddCol.value}`
      }

      emit('column', nameCol)
      modelInputAddCol.value= null
    }
    isCol.value = false
  } else {
    isCol.value = true
  }
}

</script>

<script>
export default {
  name: 'TheAddCol',
}
</script>

