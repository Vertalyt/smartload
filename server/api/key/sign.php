<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;

function signUserToken($samaccountname, $mail) {
    // Путь к закрытому ключу для подписи токена
    $privateKeyPath = $_SERVER['DOCUMENT_ROOT'] . '/api/key/patch/to/private_key.pem';

    // Проверяем, существует ли закрытый ключ
    if (!file_exists($privateKeyPath)) {
        // Обработка ошибки: закрытый ключ не найден
        die('Ошибка: Закрытый ключ не найден');
    }

    // Закрытый ключ для подписи токена
    $privateKey = file_get_contents($privateKeyPath);

    // Время жизни токена (например, 1 час)
    $tokenExpirationTime = time() + 3600;

    // Создание токена
    $token = JWT::encode(
        array(
            "iss" => "smart_load",
            "iat" => time(),
            "exp" => $tokenExpirationTime,
            "data" => array(
                "samaccountname" => $samaccountname,
                "mail" => $mail,
            ),
        ),
        $privateKey,
        'RS256' // Алгоритм подписи
    );

    // Возвращение токена
    return $token;
}

?>
