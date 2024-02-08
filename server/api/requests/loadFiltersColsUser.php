<?php

// Определение допустимых источников (origins)
require_once('../auth/cors.php');

// Подключение конфигурации
require_once('../auth/config.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = "Smart_load";
    try {

        $tableName = $_GET['nameTableBD'];

        // Валидация и санитизация пользовательского ввода при необходимости

        $columns = isset($_GET['columns']) ? $_GET['columns'] : array(); // Массив переданных столбцов

        $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // URL-кодирование имен столбцов
        $encodedColumns = array_map('urlencode', $columns);

        // Подготовка списка столбцов для запроса
        $columnList = empty($columns) ? '*' : implode(', ', $encodedColumns);

        $sql = "SELECT $columnList FROM $tableName";

        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $result = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        // Установка соответствующих заголовков
        header('Content-Type: application/json');

        // Возвращаем результат в формате JSON
        echo json_encode($result);

    } catch (PDOException $e) {
        // Логирование или обработка ошибок должным образом
        echo json_encode(array("error" => "Ошибка подключения к базе данных: " . $e->getMessage()));
    } finally {
        $conn = null;
    }
}
?>
