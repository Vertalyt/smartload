import { watch, ref } from 'vue'

export function useResultArray({
    dataTable,
    start,
    end,
    filterSearch,
  }) {
      const result = ref(dataTable.value.slice(start.value, end.value))
      watch([start, end, dataTable], val => {
        if(filterSearch.value) {
            result.value = filterSearch.value.slice(val[0], val[1])
        } else {
            result.value = dataTable.value.slice(val[0], val[1])
        }
      }, { deep:true })
      return result
  }