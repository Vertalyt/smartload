<?php


// Определение допустимых источников (origins)
require_once('cors.php');

// Подключение конфигурации
require_once('config.php');




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
