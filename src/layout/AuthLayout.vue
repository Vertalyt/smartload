<template>
  <div class="relative min-h-screen min-w-[280px] bg-gray-200">

    <div class="flex items-center justify-between p-6">

      <a href="#" class="flex items-center gap-2">
        <TheShieldSVG class="h-10 text-green-600" />
        <span class="text-xl font-black">Security</span>
      </a>
      
        <SubmitButton @submit="onSubmit" color="green" nameBtn="Главная" />
    </div>

    <RouterView />

    <TheWaveSVG class="absolute bottom-0" />
  </div>
</template>

<script setup>
import TheWaveSVG from "@/assets/img/svg/TheWaveSVG.vue";
import TheShieldSVG from "@/assets/img/svg/TheShieldSVG.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import { useRouter } from 'vue-router'

defineEmits({});
defineProps({});

const router = useRouter()
const onSubmit = () => {
  router.push('/')
}

</script>

<script>
export default {
  name: "AuthLayout",
};
</script>
