<template>
  <div class="relative min-h-screen min-w-[280px] ">

      <!-- меню -->
      <div class="flex w-full items-center justify-between p-6">
        <TheHeader />

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
import TheHeader from '@/components/TheHeader.vue'

</script>

<script>
export default {
  name: "MainLayout",
};
</script>
