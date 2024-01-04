
export const COLOR_VARIABLE_BTN =  { 
      blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      red: 'bg-red-500 hover:bg-red-700 focus:ring-red-600',
      green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      white: 'bg-white hover:bg-gray-200 focus:ring-gray-200 font-extrabold',
    }

export const TOKEN_KEY = "authToken";

export const PAGINATE_COAST_VARIABLE = ['10', '15', '20', '50', '100'];

export const USERS_BD = 'Users';

export const ADD = 'Додати';

export const REMOVE = 'Вилучити'


export const TABLES_USERS_BD = {
  info : 'user_info',
  u_access: 'user_access',
  t_access : 'table_access',
  permissions : 'permissions',
  groups : 'groups',
  g_permissions : 'group_permissions',
  c_filter : 'column_filter',
  db_access : 'data_base_acces'
}

export const GROUPS_PARAM = {
  nameBD: USERS_BD,
  nameTableBD: TABLES_USERS_BD.groups,
};

export const PERMISSIONS_PARAM = {
  nameBD: USERS_BD,
  nameTableBD: TABLES_USERS_BD.permissions,
};

export const GROUP_PERMISSIONS_PARAM = {
  nameBD: USERS_BD,
  nameTableBD: TABLES_USERS_BD.g_permissions,
};


export const USERS = {
  nameBD: USERS_BD,
  nameTableBD: TABLES_USERS_BD.info,
};




export const MENUDATE = [
  { name: 'Головна', link: '/' },
  { name: 'Групи', link: '/group-permissions' },
  { name: 'Користувачі', link: '/users-permissions' },
]

export const statusUsers = ["Активно", "Вимкнено"];