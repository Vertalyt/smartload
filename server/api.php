<?php
// Определение допустимых источников (origins)
$allowed_origins = [
    'http://localhost:5173',
    // Add other allowed origins if needed
];

// Проверка, является ли текущий источник допустимым
$current_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Разрешаем только запросы с допустимых источников
if (in_array($current_origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $current_origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}

// Если это запрос OPTIONS, завершаем скрипт
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Разрешенные операции для примера
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Ваш код для GET-запроса
    echo "Пример ответа на GET-запрос";
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ваш код для POST-запроса
    $data = json_decode(file_get_contents('php://input'), true);
    echo json_encode(['message' => 'Пример ответа на POST-запрос', 'data' => $data]);
} else {
    // Неизвестный метод запроса
    http_response_code(405);
    echo "Метод запроса не поддерживается";
}

// // Замените значения переменных на свои данные
// $ad_server = '10.100.10.1';
// $ad_user = 'Test-VS@etx.def';
// $ad_password = 'Ch9T9(m_dJ5~!Gf9';
// $base_dn = '10.100.10.1';

// // Устанавливаем соединение
// $ldap_conn = ldap_connect($ad_server);
// ldap_set_option($ldap_conn, LDAP_OPT_PROTOCOL_VERSION, 3);

// if ($ldap_conn) {
//     // Привязываемся к серверу с использованием имени пользователя и пароля
//     $ldap_bind = ldap_bind($ldap_conn, $ad_user, $ad_password);

//     if ($ldap_bind) {
//         // Операции, например, поиск пользователя
//         $search_filter = "(sAMAccountName=username)";
//         $result = ldap_search($ldap_conn, $base_dn, $search_filter);
//         $entry = ldap_get_entries($ldap_conn, $result);

//         // Важно: выводите результат как JSON
//         header('Content-Type: application/json');
//         echo json_encode(["message" => "Успешное подключение", "user" => $entry[0]["cn"][0]]);

//         // Закрываем соединение
//         ldap_unbind($ldap_conn);
//     } else {
//         // Важно: выводите результат как JSON
//         header('Content-Type: application/json');
//         http_response_code(401);
//         echo json_encode(["message" => "Не удалось подключиться"]);
//     }
// } else {
//     // Важно: выводите результат как JSON
//     header('Content-Type: application/json');
//     http_response_code(500);
//     echo json_encode(["message" => "Не удалось установить соединение"]);
// }
?>