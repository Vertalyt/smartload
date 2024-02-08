<?php

// Определение допустимых источников (origins)
require_once('../auth/cors.php');

// Подключение конфигурации
require_once('../auth/config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Логирование запроса и данных
    $logFilePath = 'C:\\Work\\error_log.txt';
    error_log("Request: " . file_get_contents('php://input'), 3, $logFilePath);
    $database = "Smart_load";
    try {
        // Получение данных из потока ввода
        $postData = json_decode(file_get_contents('php://input'), true);

        // Проверка наличия необходимых ключей
        if (isset($postData['nameTableBD'], $postData['columnName'])) {
            $tableName = $postData['nameTableBD'];
            $columnName = $postData['columnName'];

            // Валидация и санитизация пользовательского ввода при необходимости

            $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Подготовка и выполнение SQL-запроса на удаление столбца
            $sql = "ALTER TABLE $tableName DROP COLUMN $columnName";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            // Установка соответствующих заголовков
            header('Content-Type: application/json');

            // Возвращаем подтверждение в формате JSON
            echo json_encode(array("success" => "Столбец успешно удален"));
        } else {
            // Если не хватает ключей в данных
            echo json_encode(array("error" => "Отсутствуют необходимые ключи в данных"));
        }
    } catch (PDOException $e) {
        // Логирование или обработка ошибок должным образом
        echo json_encode(array("error" => "Ошибка подключения к базе данных: " . $e->getMessage()));
    } finally {
        $conn = null;
    }
}

?>
