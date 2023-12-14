<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Определение допустимых источников (origins)
$allowed_origins = [
    'http://localhost:5173',
    // Добавьте другие допустимые источники при необходимости
];

// Проверка, является ли текущий источник допустимым
$current_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Разрешаем только запросы с допустимых источников
if (in_array($current_origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $current_origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}

// Если это запрос OPTIONS, завершаем скрипт
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die('OK');
}

// Обработчик ошибок для ldap_bind
function ldapErrorHandler($errno, $errstr) {
    if (strpos($errstr, 'ldap_bind(): Unable to bind to server: Invalid credentials') !== false) {
        // Логин/пароль не верны
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(["message" => "Неверные логин или пароль"]);
        exit; // Выход из скрипта после отправки ответа
    }

    // Другие виды ошибок
    error_log("Error: " . $errstr);

    // Возвращаем общий статус ошибки 500
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["message" => "Произошла ошибка"]);
    exit; // Выход из скрипта после отправки ответа
}

// Регистрируем обработчик ошибок для ldap_bind
set_error_handler('ldapErrorHandler', E_WARNING);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из тела POST-запроса
    $input_data = json_decode(file_get_contents('php://input'), true);

    // Проверка, что данные присутствуют и имеют необходимую структуру
    if ($input_data && isset($input_data['ad_user']) && isset($input_data['ad_password'])) {
        $ad_user = $input_data['ad_user'];
        $ad_password = $input_data['ad_password'];

        try {
            $ldap_conn = ldap_connect("ldap://10.100.10.1");
            ldap_set_option($ldap_conn, LDAP_OPT_PROTOCOL_VERSION, 3);

            if ($ldap_conn) {
                // Добавляем префикс, если его нет
                if (strpos($ad_user, 'xatanet\\') !== 0) {
                    $ad_user = 'xatanet\\' . $ad_user;
                }

                $ldap_bind = ldap_bind($ldap_conn, $ad_user, $ad_password);

                if ($ldap_bind) {
                    // Ваш код обработки успешной аутентификации
                    // ...

                    ldap_unbind($ldap_conn);
                }
            }
        } catch (Exception $e) {
            // В случае других ошибок
            $error_message = $e->getMessage();
            error_log("Error: " . $error_message);

            // Возвращаем общий статус ошибки 500
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(["message" => "Произошла ошибка"]);
        }
    } else {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(["message" => "Неверные данные в запросе"]);
    }
}

// Восстанавливаем стандартный обработчик ошибок
restore_error_handler();
?>
