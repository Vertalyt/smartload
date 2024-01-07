<?php

// Определение допустимых источников (origins)
require_once('../auth/cors.php');

// Подключение конфигурации
require_once('../auth/config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Логирование запроса и данных
    $logFilePath = 'C:\\Work\\error_log.txt';
    error_log("Request: " . file_get_contents('php://input'), 3, $logFilePath);

    try {
        // Получение данных из потока ввода
        $postData = json_decode(file_get_contents('php://input'), true);

        // Проверка наличия необходимых ключей
        if (isset($postData['nameBD'], $postData['nameTableBD'], $postData['date'])) {
            $database = $postData['nameBD'];
            $tableName = $postData['nameTableBD'];
            $date = $postData['date'];

            // Валидация и санитизация пользовательского ввода при необходимости

            $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Получаем id из данных
            $IDLine = $date['id']; // Предполагается, что 'id' - это ключ в ваших данных

            $sql = "UPDATE $tableName SET ";

            // Подготавливаем массив для хранения ключей (имен столбцов)
            $columns = array_keys($date);

            // Создаем часть SQL-запроса для каждого столбца, исключая 'id'
            foreach ($columns as $column) {
                if ($column != 'id') {
                    $sql .= "$column = :$column, ";
                }
            }

            // Удаляем последнюю запятую и пробел
            $sql = rtrim($sql, ', ');

            $sql .= " WHERE id = :id";

            $stmt = $conn->prepare($sql);

            // Привязываем параметры для каждого столбца, исключая 'id'
            foreach ($columns as $column) {
                if ($column != 'id') {
                    $stmt->bindValue(":$column", $date[$column]);
                }
            }

            $stmt->bindValue(':id', $IDLine, PDO::PARAM_INT); // Параметр INT для безопасности

            $stmt->execute();

            // Установка соответствующих заголовков
            header('Content-Type: application/json');

            // Возвращаем подтверждение в формате JSON
            echo json_encode(array("success" => "Запись успешно отредактирована"));
        } else {
            // Если не хватает ключей в данных
            echo json_encode(array("error" => "Отсутствуют необходимые ключи в данных"));
        }
    } catch (PDOException $e) {
        // Логирование или обработка ошибок должным образом
        http_response_code(500); // Устанавливаем статус ошибки 500 Internal Server Error
        echo json_encode(array("error" => "Ошибка подключения к базе данных: " . $e->getMessage()));

    } finally {
        $conn = null;
    }
}
?>
