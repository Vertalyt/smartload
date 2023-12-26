<?php

require_once('cors.php');
require_once('config.php');

function getUserInfo($searchUsername) {
    global $server, $username, $password;
    $database = "Users";

    try {
        $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "SELECT * FROM user_info WHERE username = :searchUsername";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':searchUsername', $searchUsername, PDO::PARAM_STR);
        $stmt->execute();

        $result = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }

        return $result;
    } catch (PDOException $e) {
        // Логирование ошибок
        $logMessage = "PDO Error: " . $e->getMessage() . "\n";
        error_log($logMessage, 3, "C:/Work/error_log.txt");

        // Обработка ошибок подключения
        return null;
    } finally {
        // Закрываем соединение в любом случае
        if ($conn !== null) {
            $conn = null;
        }
    }
}

function createUser($userData) {
    global $server, $username, $password;
    $database = "Users";

    try {
        $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Подготовка SQL-запроса
        $sql = "INSERT INTO user_info (username, email, group_id, active_status) VALUES (:username, :email, :group_id, :active_status)";

        $stmt = $conn->prepare($sql);

        // Привязываем параметры
        $stmt->bindParam(':username', $userData['username']);
        $stmt->bindParam(':email', $userData['email']);
        $stmt->bindParam(':group_id', $userData['group_id']);
        $stmt->bindParam(':active_status', $userData['active_status']);

        // Выполняем запрос
        $success = $stmt->execute();
    } catch (PDOException $e) {
        // Обработка ошибок подключения или выполнения запроса
        $logMessage = "PDO Error: " . $e->getMessage() . "\n";
        error_log($logMessage, 3, "C:/Work/error_log.txt");
        $success = false;
    } finally {
        // Закрываем соединение в блоке finally, чтобы убедиться, что соединение закрыто независимо от результата
        if (isset($conn)) {
            $conn = null;
        }
    }

    return $success;
}

?>
