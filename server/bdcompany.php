<?php

// Определение допустимых источников (origins)
$allowed_origins = [
    'http://localhost:5173',
    // Add other allowed origins if needed
];

// Проверка, является ли текущий источник допустимым
$current_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Разрешаем только запросы с допустимых источников
if (in_array($current_origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $current_origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}

// Если это запрос OPTIONS, завершаем скрипт
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$server = '10.100.6.2';
$database = 'ContragentDataDB';
$username = 'sa';
$password = '7!5sBU+H9umeD&5!';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        $sql = "SELECT * FROM WFCompany";
    
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $result = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
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
