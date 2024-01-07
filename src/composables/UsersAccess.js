import { watch, ref } from 'vue'

export function useBDAccess(BD_access) {
    const result = ref()
    watch(BD_access, (val) => {

        result.value = val.map((b) => b.bd_name);
        },
        { immediate: true },
      );
      return result
  }


  export function itemsAccess({items, itemsAccessFilter, type, immediate}) {
    const result = ref() 

    watch(items, (val) => {
        result.value = val.map((b) => {
          const userBD = itemsAccessFilter.value.find((u) => u[type] === b);
          return {
            [type]: b,
            check: Boolean(userBD),
          };
        });
      }, { immediate });
      return result
  }