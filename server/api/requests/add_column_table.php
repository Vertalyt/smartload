<?php

// Определение допустимых источников (origins)
require_once('../auth/cors.php');

// Подключение конфигурации
require_once('../auth/config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Логирование запроса и данных
    // $logFilePath = 'C:\\Work\\error_log.txt';
    // error_log("Запрос: " . file_get_contents('php://input') . PHP_EOL, 3, $logFilePath);

    $database = "Smart_load";
    try {
        // Получение данных из потока ввода
        $postData = json_decode(file_get_contents('php://input'), true);

        // Проверка наличия необходимых ключей
        if (isset($postData['nameTableBD'], $postData['columnName'], $postData['columnType'])) {
            $tableName = $postData['nameTableBD'];
            $columnName = $postData['columnName'];
            $columnType = $postData['columnType'];

            // Валидация и санитизация пользовательского ввода при необходимости

            $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Подготовка и выполнение SQL-запроса на добавление колонки
            $sql = "ALTER TABLE $tableName ADD $columnName $columnType";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            // Установка соответствующих заголовков
            header('Content-Type: application/json');

            // Возвращаем подтверждение в формате JSON
            echo json_encode(array("success" => "Колонка успешно добавлена"));
        } else {
            // Если не хватает ключей в данных
            http_response_code(400); // Bad Request
            echo json_encode(array("error" => "Отсутствуют необходимые ключи в данных", "details" => "Дополнительная информация об ошибке"));
            
        }

    } catch (PDOException $e) {
        // Логирование или обработка ошибок должным образом
        // $errorLogFilePath = 'C:\\Work\\error_log.txt';
        // error_log("Ошибка базы данных: " . $e->getMessage() . PHP_EOL, 3, $errorLogFilePath);
        // error_log("Данные запроса: " . file_get_contents('php://input') . PHP_EOL, 3, $errorLogFilePath);

        // Возвращаем HTTP-код ошибки
        // http_response_code(500); // Internal Server Error
        // echo json_encode(array("error" => "Неизвестная ошибка", "details" => $e->getMessage()));


                // Возвращаем HTTP-код ошибки и детали ошибки
                $statusCode = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
                http_response_code($statusCode);
                echo json_encode(array("error" => "Ошибка базы данных", "details" => $e->getMessage()));
              
        
    } finally {
        $conn = null;
    }
}
?>
