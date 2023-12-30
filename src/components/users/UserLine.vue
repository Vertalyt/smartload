
<template>
        <div :class="styleCardLine">

          {{ title }}

          <span 
          :class="styleTextLine"
          >
            <slot />
          </span>

        </div>

</template>

<script setup>

defineProps({
  title: {
    required: true,
    type: String
  },
})

const styleCardLine =
  "flex flex-col w-full md:flex-row items-center justify-evenly text-sm lg:text-lg font-bold font-gray-700 mx-4";

  const styleTextLine =
  "flex items-center justify-center text-md font-normal md:ml-3";
</script>

<script>
export default {
  name: 'UserLine',
}
</script>

