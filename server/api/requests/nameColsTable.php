<?php

// Определение допустимых источников (origins)
require_once('../auth/cors.php');

// Подключение конфигурации
require_once('../auth/config.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = "Smart_load";

    try {
        // Получение значений с фронта
        $bdName = $_GET['bd_name'];
        $tableName = $_GET['table_name'];
        $filterColumn = isset($_GET['filterColumn']) ? $_GET['filterColumn'] : null;
        $filterValue = isset($_GET['filterValue']) ? $_GET['filterValue'] : null;

        // Валидация и санитизация пользовательского ввода при необходимости

        // Используйте подготовленные запросы для предотвращения SQL-инъекций
        $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // SQL-запрос с учетом фильтрации
        $sql = "SELECT * FROM lis_names_tables_col WHERE bd_name = :bdName AND table_name = :tableName";
        if ($filterColumn !== null && $filterValue !== null) {
            $sql .= " AND $filterColumn = :filterValue";
        }

        $stmt = $conn->prepare($sql);

        // Привязка параметров для фильтрации
        $stmt->bindParam(':bdName', $bdName);
        $stmt->bindParam(':tableName', $tableName);
        if ($filterColumn !== null && $filterValue !== null) {
            $stmt->bindParam(':filterValue', $filterValue);
        }

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
