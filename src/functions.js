export function decrement({ arrayFilter, count }) {
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

export function sortAndFilter({ sort, dataTable }) {
  // Применение фильтрации столбцов только из sort
  const filteredData = dataTable.map((line) => {
    const filteredLine = Object.keys(line)
      .filter((key) => sort.some((s) => s.nameFilter === key))
      .reduce((obj, key) => {
        obj[key] = line[key];
        return obj;
      }, {});
    return filteredLine;
  });
  // Сортировка по значениям в поле count
  return sortAfterFiltering(sort, filteredData);
}

function sortAfterFiltering(sort, filteredData) {
  return filteredData.map((item) => {
    const sortedItem = sort
      .sort((a, b) => a.count - b.count)
      .reduce((obj, sortItem) => {
        const key = sortItem.nameFilter;
        obj[key] = item[key];
        return obj;
      }, {});
    return sortedItem;
  });
}

export function colName(val) {
  // получаю имена колонок
  const nameCol = Object.keys(val[0]);
  // Найти индекс элемента "ID"
  const indexOfID = nameCol.indexOf("ID");
  // Проверить, найден ли элемент "ID"
  if (indexOfID !== -1) {
    // Удалить элемент "ID" с использованием splice
    nameCol.splice(indexOfID, 1);
  }
  return nameCol
}


export function computeTextHeight(content, key) {
  // ширина строки
  const widthLines = key.length * 1.5;
  const lineHeight = 24; // Замените это на реальную высоту строки
  const minHeight = 80; // Минимальная высота textarea

  // ширина текста
  const lines = String(content).length;
  // количество строк
  const countLines = lines / widthLines;
  const height = Math.max(countLines * lineHeight, minHeight);
  return height;
};


// Функция для поиска индекса строки в массиве по ID
function findDataIndex (arrUpdate, editArr) {
  return arrUpdate.findIndex(line => Number(line.ID) === Number(editArr.ID));
};

// Функция для обновления данных в массиве по индексу
export function updateDataById ({arrUpdate, editArr}){
    const dataIndex = findDataIndex(arrUpdate, editArr)
  if (dataIndex !== -1) {
    for (const key in editArr) {
      if (Object.prototype.hasOwnProperty.call(editArr, key) && Object.prototype.hasOwnProperty.call(arrUpdate[dataIndex], key)) {
      arrUpdate[dataIndex][key] = editArr[key];
      }
    }
    return arrUpdate;
  }
};


export function tableFocus() {
  const btnSend = document.querySelector('#sendRef');
  if(btnSend) {
  btnSend.focus()
}
}


export function sortSearch({search, arr}) {
  return arr.filter((line) => {
    const lineAsString = JSON.stringify(line).toLowerCase();
    return lineAsString.includes(search.toLowerCase());
  });
}