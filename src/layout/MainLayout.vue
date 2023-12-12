<template>
  <div class="relative min-h-screen min-w-[280px] ">

      <!-- меню -->
      <div class="flex w-full items-center justify-between p-6">
        <div class="z-10 flex w-full items-center justify-between rounded-xl">
          <div class="flex items-center">
            <RouterLink to="/" class="mr-10 flex items-center gap-3">
              <SogSVG class="h-10 text-green-600" />
              <span class="text-xl font-black">Download</span>
            </RouterLink>

            <ul class="items-center sm:gap-5 hidden sm:flex">
              <li
                class="rounded-xl bg-blue-600 px-2 py-2 font-semibold text-gray-200 shadow-lg transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 md:px-4"
              >
                <RouterLink to="./">Главная</RouterLink>
              </li>
              <li
                class="rounded-xl bg-blue-600 px-2 py-2 font-semibold text-gray-200 shadow-lg transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 md:px-4"
              >
                <RouterLink to="./login">Авторизация</RouterLink>
              </li>
            </ul>
          </div>

          <SubmitButton
            nameBtn="Выход"
            color="blue"
            @submit="isLogaut"
            class="mr-2 hidden sm:flex"
          />
        </div>


      <!-- контент -->
      <div
        class="absolute left-0 right-0 top-20 z-10 m-8 min-h-[85vh] min-w-[80vw] rounded-xl border border-gray-300 bg-gray-400/50 p-8 shadow-xl backdrop-blur-xl"
      >
        <RouterView />
      </div>
      
    </div>

    <TheWavesMainSVG class="fixed bottom-0" />

  </div>
</template>

<script setup>
import TheWavesMainSVG from "@/assets/img/svg/TheWavesMainSVG.vue";
import SogSVG from "@/assets/img/svg/SogSVG.vue";
import SubmitButton from "@/components/SubmitButton.vue";

defineEmits({});
defineProps({});

const isLogaut = () => {
  console.log("Выйти");
};
</script>

<script>
export default {
  name: "MainLayout",
};
</script>
