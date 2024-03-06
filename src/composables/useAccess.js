import router from '@/router'
import { watch, computed } from 'vue'
import { useAuthStore } from "@/stores/auth";
import { useMessage } from "@/stores/message";
import { allowed_group } from "@/constants";

export function useAccessPage(key) {
    const message = useMessage()
    const storeAuth = useAuthStore()
    const groupUser = computed( () => storeAuth.getProperty('group_id') ) 
    const active_status = computed( () => storeAuth.getProperty('active_status') ) 
    watch(groupUser, val => {

        if(val) {
          if(!allowed_group[key].includes(Number(val)) || Number(active_status.value) === 0){
          router.push('./')
          message.setMessage({
            type : 'warning',
            value: 'Нема доступу'
          })
        }
        }
      }, { immediate:true } )
}