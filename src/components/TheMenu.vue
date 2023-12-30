
<template>
            <ul  class="items-center sm:gap-5">
              <li 
              v-for="link in MENUDATE"
              :key="link.name"
              >
                <RouterLink :to="link.link" class="rounded-xl bg-blue-600 p-2 md:px-4 font-semibold text-gray-200 shadow-lg transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" 
                class-active="active">{{ link.name }}</RouterLink>
              </li>
            </ul>
</template>


<script setup>
import { MENUDATE } from '@/constants'



</script>

<script>
export default {
  name: 'TheMenu',
}
</script>

<style>
.active {
    opacity: 1;
    background-color: rgb(70, 98, 175);
    padding: 0.375rem 2rem;
    color: rgb(248 250 252);
    font-weight: bold;
}
</style>