import { watch, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'


export function useBDAccess(BD_access) {
    const result = ref()
    watch(BD_access, (val) => {

        result.value = val.map((b) => b.bd_name);
        },
        { immediate: true },
      );
      return result
  }


  export function useItemsAccess({items, itemsAccessFilter, type, immediate = false}) {
    const result = ref() 
    watch(items, (val) => {
        result.value = val.map((b) => {
          const userBD = itemsAccessFilter.value.find((u) => u[type] === b);
          return {
            [type]: b,
            check: Boolean(userBD),
          };
        });
      }, { immediate, deep:true });

      return result
  }



  export function useUsersLogin({listsUsers}) {
    const result = ref()

    watch(listsUsers, val => {
     
      result.value = val
      .map((u) => {
        return {
          login: u.samaccountname,
        };
      })
      .sort((a, b) => a.login.localeCompare(b.login));
    }, { immediate : true }  )


    return result.value
  }


  export function useAccessColl(tablesColsName) {
    const authStore = useAuthStore()
    const t_access = authStore.getProperty('cols_access')

   return tablesColsName.map( c => {
      const findAccess = t_access.find(a => a.bd_name === c.BD_name && a.table_name === c.table_name && a.cols_name === c.key_Cols)
        if(findAccess) {
          return c
        } else {
          return undefined
        }
    } ).filter(r => r !== undefined)

  }