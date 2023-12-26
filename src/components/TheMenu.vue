
<template>
            <ul  class="items-center sm:gap-5 hidden sm:flex">
              <li 
              v-for="link in menuDate"
              :key="link.name"
              >
                <RouterLink :to="link.link" class="rounded-xl bg-blue-600 p-2 md:px-4 font-semibold text-gray-200 shadow-lg transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" 
                class-active="active">{{ link.name }}</RouterLink>
              </li>
            </ul>
</template>


<script setup>

const menuDate = [
  { name: 'Головна', link: '/' },
  { name: 'Авторизація', link: '/auth' },
  { name: 'Групи', link: '/group-permissions' },
]

</script>

<script>
export default {
  name: 'TheMenu',
}
</script>

<style>
.active {
    opacity: 1;
    background-color: rgb(30 58 138);
    padding: 0.375rem;
}
</style>