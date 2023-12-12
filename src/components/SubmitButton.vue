
<template>
      <button @click.stop ="emit('submit')"
        :class="classesBTN"
        >{{ nameBtn }}</button
      >
</template>


<script setup>
import { COLOR_VARIABLE_BTN } from '@/constans'
import { computed } from 'vue'



const emit = defineEmits({
  submit: null,
});
const props = defineProps({
  nameBtn: {
    required: true,
    type: String,
  },
  color:{
    required: true,
    type: String,
    validator(color) {
      return Object.keys(COLOR_VARIABLE_BTN).includes(color)
    },
  }
})

const isColor = computed( () => [COLOR_VARIABLE_BTN[props.color]] )

const classesBTN = ['rounded-md px-4 py-2 font-semibold text-white shadow-lg transition duration-150 ease-in-out hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2', [...isColor.value]]


</script>

<script>
export default {
  name: 'SubmitButton',
}
</script>

