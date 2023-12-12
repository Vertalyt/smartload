
export function decrement({arrayFilter, count}) {
    return arrayFilter.map((filter) => {
          if (filter.count >= count) {
            return {
              nameFilter: filter.nameFilter,
              count: filter.count - 1,
            };
          } else {
            return {
              ...filter,
            };
          }
        });
  }