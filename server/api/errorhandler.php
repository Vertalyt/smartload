<?php

function ldapErrorHandler($errno, $errstr)
{
    if (strpos($errstr, 'ldap_bind(): Unable to bind to server: Invalid credentials') !== false) {
        // Логин/пароль не верны
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(["message" => "Неверные логин или пароль"], JSON_UNESCAPED_UNICODE);
        exit; // Выход из скрипта после отправки ответа
    }

    // Другие виды ошибок
    error_log("Error: " . $errstr);

    // Возвращаем общий статус ошибки 500
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["message" => "Произошла ошибка"], JSON_UNESCAPED_UNICODE);
    exit; // Выход из скрипта после отправки ответа
}

?>