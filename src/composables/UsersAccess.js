import { watch, ref,  } from 'vue'

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