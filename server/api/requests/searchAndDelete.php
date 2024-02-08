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
        if (isset($postData['nameTableBD'], $postData['criteria'])) {
            $nameTableBD = $postData['nameTableBD'];
            $criteria = $postData['criteria'];

            // Валидация и санитизация пользовательского ввода при необходимости

            $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Подготовка и выполнение SQL-запроса на удаление записей
            $sql = "DELETE FROM $nameTableBD WHERE ";
            $whereClauses = [];
            $params = [];

            foreach ($criteria as $columnName => $columnValue) {
                $whereClauses[] = "$columnName = ?";
                $params[] = $columnValue;
            }

            $sql .= implode(" AND ", $whereClauses);

            $stmt = $conn->prepare($sql);

            foreach ($params as $index => $param) {
                $stmt->bindValue(($index + 1), $param, is_int($param) ? PDO::PARAM_INT : PDO::PARAM_STR);
            }

            $stmt->execute();

            // Установка соответствующих заголовков
            header('Content-Type: application/json');

            // Возвращаем подтверждение в формате JSON
            echo json_encode(array("success" => "Записи успешно удалены"));
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
