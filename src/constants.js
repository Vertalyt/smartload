
export const allowed_group = { 'group': [1, 2], 'users': [1, 2] };
export const allowed_group_editor = { 'group': [...allowed_group.group, 3], 'users': [...allowed_group.users, 3] };

export const COLOR_VARIABLE_BTN =  { 
      blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      red: 'bg-red-500 hover:bg-red-700 focus:ring-red-600',
      green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      white: 'bg-white hover:bg-gray-200 focus:ring-gray-200 font-extrabold',
      gray: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-600 font-extrabold',
    }

export const TOKEN_KEY = "authToken";

export const PAGINATE_COAST_VARIABLE = ['10', '15', '20', '50', '100'];

export const USERS_BD = 'Users';

export const ADD = 'Додати';

export const REMOVE = 'Вилучити'

export const EDIT = 'Редагувати'

export const TABLES_USERS_BD = {
  info : 'user_info',
  t_access : 'table_access',
  permissions : 'permissions',
  groups : 'groups',
  g_permissions : 'group_permissions',
  db_access : 'data_base_acces',
  c_access: 'cols_access'
}


export const MENUDATE = [
  { name: 'Головна', link: '/' },
  { name: 'Групи', link: '/group-permissions' },
  { name: 'Користувачі', link: '/users-permissions' },
]

export const statusUsers = ["Активно", "Вимкнено"];

export const bDLists = {
  bdName: 'BD_lists',
  table_name: 'lis_names_tables_col'
}