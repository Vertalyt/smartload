<?php
require_once('cors.php');
require '../key/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из тела POST-запроса
    $input_data = json_decode(file_get_contents('php://input'), true);
    // echo json_encode($input_data, JSON_UNESCAPED_UNICODE);

    // Проверка, что данные присутствуют и имеют необходимую структуру
    if ($input_data && isset($input_data['clientToken'])) {
        $clientToken = $input_data['clientToken'];

        // Открытый ключ для верификации токена
        $publicKeyPath = $_SERVER['DOCUMENT_ROOT'] . '/api/key/patch/to/public_key.pem';

        if (!file_exists($publicKeyPath)) {
            // Обработка ошибки: Открытый ключ не найден
            die('Ошибка: Открытый ключ не найден');
        }

        try {
            // Верификация токена
            $publicKey = file_get_contents($publicKeyPath);
            $decoded = JWT::decode($clientToken, new Key($publicKey, 'RS256'));
        
            // Проверка срока действия токена
            $current_time = time();
            $expiration_time = $decoded->exp ?? null;
        
            if ($current_time > $expiration_time) {
                // Токен истек, обработка ошибки
                header('Content-Type: application/json');
                http_response_code(401); // Неавторизовано
                echo json_encode(["message" => "Срок действия токена истек"], JSON_UNESCAPED_UNICODE);
                exit;
            }
        
            // Извлекаем данные пользователя
            $userData = $decoded->data;
        
            // Извлекаем email и login (samaccountname)
            $email = $userData->mail ?? null;
            $login = $userData->samaccountname ?? null;
        
            // Возвращаем модифицированные данные
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "data" => ["email" => $email, "login" => $login]], JSON_UNESCAPED_UNICODE);
            // Здесь можно вернуть успешный ответ, если это необходимо
        
        } catch (Exception $e) {
            // Обработка ошибки верификации токена
            header('Content-Type: application/json');
            http_response_code(401); // Неавторизовано
            echo json_encode(["message" => "Ошибка верификации токена", "error" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }        
    } else {
        header('Content-Type: application/json');
        http_response_code(400); // Плохой запрос
        echo json_encode(["message" => "Отсутствует токен в запросе"], JSON_UNESCAPED_UNICODE);
    }
}
