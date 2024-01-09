import { statusUsers } from "@/constants";

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
  // Найти индекс элемента "id"
  const indexOfID = nameCol.indexOf("id");
  // Проверить, найден ли элемент "id"
  if (indexOfID !== -1) {
    // Удалить элемент "id" с использованием splice
    nameCol.splice(indexOfID, 1);
  }
  return nameCol;
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
}

// Функция для поиска индекса строки в массиве по id
function findDataIndex(arrUpdate, editArr) {
  return arrUpdate.findIndex((line) => Number(line.id) === Number(editArr.id));
}

// Функция для обновления данных в массиве по индексу
export function updateDataById({ arrUpdate, editArr }) {
  const dataIndex = findDataIndex(arrUpdate, editArr);
  if (dataIndex !== -1) {
    for (const key in editArr) {
      if (
        Object.prototype.hasOwnProperty.call(editArr, key) &&
        Object.prototype.hasOwnProperty.call(arrUpdate[dataIndex], key)
      ) {
        arrUpdate[dataIndex][key] = editArr[key];
      }
    }
    return arrUpdate;
  }
}

export function tableFocus() {
  const btnSend = document.querySelector("#sendRef");
  if (btnSend) {
    btnSend.focus();
  }
}

export function sortSearch({ search, arr }) {
  return arr.filter((line) => {
    const lineAsString = JSON.stringify(line).toLowerCase();
    return lineAsString.includes(search.toLowerCase());
  });
}

function findPermissions(allPermissions, itemsSorts) {
  return allPermissions.value.filter((p) => {
    const coincidence = itemsSorts.find(
      (group_p) => group_p.permission_id === p.permission_id,
    );
    if (coincidence) {
      return p;
    }
  });
}

export function editGroup({
  groupList,
  groupName,
  groups_permissions,
  allPermissions,
}) {
  //ищу айди группы
  const group_id = groupList.value.find((g) => g.group_name === groupName);
  if (group_id && group_id.group_id) {
    //нахожу все айди разрешений для этой группы
    const permissionsOneGroup = groups_permissions.value.filter(
      (g) => g.group_id === group_id.group_id && g.allowed === "1",
    );

    // нахожу все включенные записи
    const accessPermissions = permissionsOneGroup.filter(
      (p) => p.isEnable === "1",
    );

    //нахожу все имена разрешения для этой группы
    const allPermissionsSortName = findPermissions(
      allPermissions,
      permissionsOneGroup,
    );

    //нахожу все имена включенные для этой группы
    const accessPermissionsName = findPermissions(
      allPermissions,
      accessPermissions,
    );

    return { allPermissionsSortName, accessPermissionsName };
  } else {
    return undefined;
  }
}

// сортирую по айди
export function sortArr(arr) {
  return arr.sort((a, b) => a.permission_id - b.permission_id);
}

export function formatMyDateString(dateString) {
  const inputDate = new Date(dateString);

  const options = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("ua-UA", options);
  return formatter.format(inputDate);
}

export function statusChange(change) {
  return change === statusUsers[0] ? "1" : "0";
}

export function searchIdGroups(usersGroups, user_group_name) {
  return usersGroups.find((g) => g.group_name === user_group_name).group_id;
}

export function searchNameGroups(usersGroups, user_group_id) {
  return usersGroups.find((g) => g.group_id === user_group_id).group_name;
}
