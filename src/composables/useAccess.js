import router from '@/router'
import { watch, computed } from 'vue'
import { useAuthStore } from "@/stores/auth";
import { useMessage } from "@/stores/message";
import { allowed_group } from "@/constants";

export function useAccessPage(key) {
    const message = useMessage()
    const storeAuth = computed ( () => useAuthStore()) 
    const groupUser = computed( () => storeAuth.value.getProperty('group_id') ) 

    watch(groupUser, val => {

        if(val) {
          if(!allowed_group[key].includes(Number(val))){
          router.push('./')
          message.setMessage({
            type : 'warning',
            value: 'Нема доступу'
          })
        }
        }
      }, { immediate:true } )
}