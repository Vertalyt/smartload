import { statusUsers } from "@/constants";
import Papa from 'papaparse';
// import { jsPDF } from 'jspdf'
// import '@/OpenSans-Medium-normal.js'

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




// {
//   "ID": "1",
//   "BD_name": "ContragentDataDB",
//   "table_name": "WFCompany",
//   "key_Cols": "CompanyName",
//   "name_ua_cols": "Имя компанії"
// },
// {
//   "ID": "2",
//   "BD_name": "ContragentDataDB",
//   "table_name": "WFCompany",
//   "key_Cols": "Address",
//   "name_ua_cols": "Адреса"
// },


// [
//   {
//       "nameFilter": "id",
//       "count": 0
//   },
//   {
//       "nameFilter": "Имя компанії",
//       "count": 1
//   },
// ]


function changeKeyValue(sort, keyCols) {
    return sort.map(n => {
      const find = keyCols.find(c => c.key_Cols === n.nameFilter)
      if(find) {
        return {
          ...n,
          nameFilter: find.key_Cols
        }
      } else {
        return n
      }
    })
}

export function sortAndFilter({ sort, dataTable, keyCols }) {

  const newSort = changeKeyValue(sort, keyCols)

  // Применение фильтрации столбцов только из newSort
  const filteredData = dataTable.map((line) => {
    const filteredLine = Object.keys(line)
      .filter((key) => newSort.some((s) => s.nameFilter === key))
      .reduce((obj, key) => {
        obj[key] = line[key];
        return obj;
      }, {});
    return filteredLine;
  });

  // Сортировка по значениям в поле count
  return sortAfterFiltering(newSort, filteredData);
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

export function tableFocus(el) {
  const btnSend = document.querySelector(el);
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



export function useAddLdapParamSorts({ usersParam, ollListsUsers }) {
  const updatedOllListsUsers = [...ollListsUsers.value];

  const updatedUsersParam = usersParam.value.map(u => {
    const findUserIndex = updatedOllListsUsers.findIndex(l => l.samaccountname === u.username);

    if (findUserIndex !== -1) {
      // Merge findUser and u using the spread operator
      const mergedUser = { ...updatedOllListsUsers[findUserIndex], ...u };
      // Remove the found user from the updatedOllListsUsers
      updatedOllListsUsers.splice(findUserIndex, 1);
      return mergedUser;
    } else {
      return u;
    }
  }).filter(u => u !== null && u !== undefined);

  return {
    updatedOllListsUsers,
    updatedUsersParam,
  };
}

function downloadFile(blob, nameBook, type) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nameBook}.${type}`;
  link.click();
}



export async function loadCSV({ data, nameBook, nameList}) {
   const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, `${nameBook}-${nameList}`, 'csv')
}


export async function loadXLS({ data, nameBook, nameList }) {
  const ExcelJS = await import('exceljs');
  const csv = Papa.unparse(data); // Преобразовываю массив в csv
    // Добавьте данные в лист
    const csvLines = csv.split('\r\n'); // Разбейте CSV строку на массив строк
  // Создайте новый Workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${nameList}`);
  csvLines.forEach((line) => {
    const row = Papa.parse(line, { delimiter: ',' }).data[0];
    if (row) {
      worksheet.addRow(row);
    }
  });

   // Создайте файл и сохраните его
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadFile(blob, nameBook, 'xlsx')
}

// function widthString(data) {
//   return data.map(item => {
//     // Для каждого объекта в массиве заменяем null на ''
//     const newItem = {};
//     for (const key in item) {
//       newItem[key] = item[key] === null ? '' : item[key];
//     }
//     return newItem;
//   });
  
// }

// export async function loadPDF({ data, nameBook, nameList }) {
//   await import("./OpenSans-Medium-normal.js");
 
//   const newDate = await widthString(data)
//   const doc = new jsPDF({ putOnlyUsedFonts: false, orientation: "landscape" });
//   doc.setFont("OpenSans-Medium");
//   doc.table(1, 1, newDate, Object.keys(newDate[0]), { autoSize: true });
//   doc.save(`${nameBook}-${nameList}.pdf`);
// };


export function translit(str) {
  if (!str) {
    // Обработка случая, когда str undefined, null или пустая строка
    return '';
  }

  const ru = "А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я".split("-");
  const en = "A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-YU-yu-YA-ya".split("-");
  let res = '';

  for (let i = 0, l = str.length; i < l; i++) {
    const s = str.charAt(i);
    const n = ru.indexOf(s);

    if (n >= 0) {
      // Учтем регистр
      res += (s === s.toLowerCase()) ? en[n] : en[n].toUpperCase();
    } else {
      // Обработка спецсимволов
      res += s;
    }
  }

  return res;
}




export function translateCols({date, colsName, translation}) {
  let translationCompare
  let translationKey
  if(translation) {
    translationCompare = 'key_Cols';
    translationKey = 'name_ua_cols';
  } else {
    translationCompare = 'name_ua_cols';
    translationKey = 'key_Cols';
  }
 return date.map(p => {
    Object.keys(p).forEach(key => {
      const translation = colsName.find(c => c[translationCompare] === key);
      if (translation) {
        // If there is a match, update the property name
        p[translation[translationKey]] = p[key];
        delete p[key]; // Remove the old property name
      }
    });
    return p;
  });

}


export function translateColsPermission({date, colsName, translation}) {
  let translationCompare
  let translationKey
  if(translation) {
    translationCompare = 'key_Cols';
    translationKey = 'name_ua_cols';
  } else {
    translationCompare = 'name_ua_cols';
    translationKey = 'key_Cols';
  }
const newName = []

 date.map(p => {
      const translation = colsName.find(c => c[translationCompare] === p);
      if (translation) {
        newName.push(translation[translationKey])    
      } else {
        newName.push(p)
      }
  });
  return newName
}