<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Определение допустимых источников (origins)
require_once('../auth/cors.php');

require_once('../auth/config_Ldap_connect.php');

require_once('../auth/oll_lists_users.php');

// Обработчик ошибок для ldap_bind
require_once('../auth/errorhandler.php');

// Регистрируем обработчик ошибок для ldap_bind
set_error_handler('ldapErrorHandler', E_WARNING);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    // Вызываем функцию для аутентификации
    if ($oll_users = ollUserLogin($ldap_username, $ldap__password)) {
// Создаем новый массив с нужными полями
$filtered_data = [];
foreach ($oll_users as $entry) {
    $filtered_entry = [];

    // Переменная-флаг
    $at_least_one_field_found = false;

    // Перебираем желаемые поля
    $fields = ["samaccountname", "mail", "telephonenumber", "name"];
    // $fields = ["samaccountname", "mail", "telephonenumber", "homephone", "mobile", "name"];
    foreach ($fields as $field) {
        // Проверяем, что поле существует и не пустое
        if (isset($entry[$field]) && is_array($entry[$field]) && isset($entry[$field][0])) {
            // if ($field === "telephonenumber" || $field === "homephone" || $field === "mobile") {
            //     // Если поле - один из телефонных номеров, добавляем в объект "mobile"
            //     if (!isset($filtered_entry['mobile'])) {
            //         $filtered_entry['mobile'] = [];
            //     }
            //     $filtered_entry['mobile'][] = $entry[$field][0];
            // } else {

                $filtered_entry[$field] = $entry[$field][0];
            // }
            $at_least_one_field_found = true;
        }
    }

    // Если хотя бы одно поле было найдено, добавляем запись в результат
    if ($at_least_one_field_found) {
        $filtered_data[] = $filtered_entry;
    }
}


        $data = [
            "oll_users" => $filtered_data,
        ];


        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        return;
    } else {
        // Обработка неудачной аутентификации
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(["message" => "Неверные логин или пароль"], JSON_UNESCAPED_UNICODE);
    }
} else {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(["message" => "Неверные данные в запросе"], JSON_UNESCAPED_UNICODE);
}

// Восстанавливаем стандартный обработчик ошибок
restore_error_handler();
