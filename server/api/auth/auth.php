<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Определение допустимых источников (origins)
require_once('cors.php');

require_once('auth_functions.php');

// Обработчик ошибок для ldap_bind
require_once('errorhandler.php');

// подпись токеном
require_once('../key/sign.php');

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

            // Получаем значения samaccountname и mail
            $samaccountname = isset($entry[0]['samaccountname'][0]) ? $entry[0]['samaccountname'][0] : null;
            $mail = isset($entry[0]['mail'][0]) ? $entry[0]['mail'][0] : null;


            $token = signUserToken($samaccountname, $mail);
            
            $data = [
                "user" => $samaccountname,
                "email" => $mail,
                "token" => $token,
            ];
            echo json_encode($data, JSON_UNESCAPED_UNICODE);
            return $data;
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
} else {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(["message" => "Метод не разрешен"], JSON_UNESCAPED_UNICODE);
}

// Восстанавливаем стандартный обработчик ошибок
restore_error_handler();