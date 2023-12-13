<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Определение допустимых источников (origins)
require_once('cors.php');

require_once('auth_functions.php');
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
                // Вызываем функцию для аутентификации
                if ($entry = authenticateUser($ad_user, $ad_password)) {
                    header('Content-Type: application/json');
                    echo json_encode([
                        "message" => "Успешное подключение",
                        "user" => isset($entry[0]['samaccountname'][0]) ? $entry[0]['samaccountname'][0] : null
                    ]);
                } else {
                    // Обработка неудачной аутентификации
                    header('Content-Type: application/json');
                    http_response_code(401);
                    echo json_encode(["message" => "Неверные логин или пароль"]);
                }
    } 
    else {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(["message" => "Неверные данные в запросе"]);
    }
} else {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(["message" => "Метод не разрешен"]);
}

// Восстанавливаем стандартный обработчик ошибок
restore_error_handler();
?>
