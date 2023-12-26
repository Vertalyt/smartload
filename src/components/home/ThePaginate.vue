
<template>
    <div class="example-three">
    <VueAwesomePaginate 
    :total-items="elements"
    :items-per-page="perPage"
    :max-pages-shown="pagesShown"
    v-model="currentPage"
    @click="isChange"
     >
      <template #prev-button>
        <ThePrevButton />
      </template>
      <template #next-button>
        <TheNextButton />
      </template>
    </VueAwesomePaginate>
  </div>
</template>


<script setup>
import { ref, watch, computed } from 'vue'

import ThePrevButton from '@/assets/img/svg/ThePrevButton.vue'
import TheNextButton from '@/assets/img/svg/TheNextButton.vue'
const emit = defineEmits({
  lines: Number
});
const props = defineProps({
    elements: {
        required: true,
        type: Number
    },
    pagesShown: {
        required: true,
        type: Number
    },
    perPage: {
      required: true,
        type: Number
    },
    page:{
      required: true,
        type: Number
    },
})


const currentPage = ref(1)

const isPage = computed( () => props.page )
watch(isPage, val => {
  currentPage.value = val
})
const isChange = () => {
  emit('lines', Number(currentPage.value))
}

</script>


<script>
export default {
  name: 'ThePaginate',
}
</script>



<style>
.example-three .pagination-container {
  border-radius: 22px;
  overflow: hidden;
}
.example-three .paginate-buttons {
  width: 44px;
  height: 44px;
  cursor: pointer;
  background-color: #2c3e50;
  border: none;
  color: #1abc9c;
  border-inline: 0.5px solid #1abc9c;
}
.example-three .active-page {
  background-color: #1abc9c;
  color: #2c3e50;
}
.example-three .paginate-buttons:hover {
  background-color: #34495e;
}

.example-three .active-page:hover {
  background-color: #1abc9c;
}
.example-three .back-button {
  border-inline-start: none;
}
.example-three .next-button {
  border-inline-end: none;
}
.example-three .back-button svg {
  transform: rotate(180deg);
}

.example-three .back-button:active,
.example-three .next-button:active {
  background-color: #3c5167;
}

.back-button {
  padding-left: 15px;
}

.next-button {
  padding-left: 15px;
}


@media screen and (max-width: 600px) {
  .example-three .paginate-buttons {
  width: 30px;
}
}
</style>