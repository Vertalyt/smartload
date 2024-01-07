<?php
// Определение допустимых источников (origins)
require_once('../auth/cors.php');

// Подключение конфигурации
require_once('../auth/config.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $logFilePath = 'C:\\Work\\error_log.txt';
    error_log("Request: " . file_get_contents('php://input'), 3, $logFilePath);

    try {
        // Принимаем параметр database из запроса
        $database = $_GET['nameBD'];

        $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Принимаем параметр table из запроса
        $table = $_GET['nameTableBD'];

        // SQL-запрос для получения списка колонок таблицы
        $sql = "SELECT column_name FROM information_schema.columns WHERE table_name = :table";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':table', $table, PDO::PARAM_STR);
        $stmt->execute();

        $result = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Возвращаем только названия колонок
            $result[] = $row['column_name'];
        }

        // Возвращаем результат в формате JSON
        echo json_encode($result);

    } catch (PDOException $e) {
        // Возвращаем сообщение об ошибке в формате JSON
        echo json_encode(array("error" => "Ошибка подключения к базе данных: " . $e->getMessage()));
    } finally {
        $conn = null;
    }
}
?>
