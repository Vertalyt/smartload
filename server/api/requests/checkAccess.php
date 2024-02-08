<?php

// Определение допустимых источников (origins)
require_once('../auth/cors.php');

// Подключение конфигурации
require_once('../auth/config.php');

function getUserInfo($searchUsername) {
    global $server, $username, $password;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $database = "Smart_load";
        $tableUserInfo = 'user_info';
        $groupPermissions = 'group_permissions';

        try {
            // Валидация и санитизация пользовательского ввода при необходимости

            $conn = new PDO("sqlsrv:Server=$server;Database=$database;Encrypt=false", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Логируем запрос для получения данных пользователя
            $sql = "SELECT * FROM $tableUserInfo WHERE username = '$searchUsername'";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $userInfo = $stmt->fetch(PDO::FETCH_ASSOC);

            // Логируем информацию о пользователе
            // error_log("User Info Result: " . json_encode($userInfo), 3, 'C:\\Work\\request.txt');

            if (!$userInfo) {
                return array("error" => "Пользователь не найден");
            }

            // Проверка active_status
            if ($userInfo['active_status'] == 0) {
                return array("error" => "Пользователь неактивен");
            }

            // Получение group_id
            $group_id = $userInfo['group_id'];

            // Логируем запрос для получения разрешений группы
            $sql = "SELECT * FROM $groupPermissions WHERE group_id = '$group_id' AND allowed = 1";

            $stmt = $conn->prepare($sql);
            $stmt->execute();

            // Массив для хранения разрешений группы
            $groupPermissions = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $groupPermissions[] = $row['permission_id'];
            }

            // Логируем разрешения группы
            // error_log("Group Permissions: " . json_encode($groupPermissions), 3, 'C:\\Work\\request.txt');

            // Массив разрешений для сравнения
            $expectedPermissions = [1, 2, 3, 4, 5, 6, 7];

            // Проверка разрешений
            $missingPermissions = array_diff($expectedPermissions, $groupPermissions);
            if (!empty($missingPermissions)) {
                return array("error" => "Отсутствуют необходимые разрешения");
            }

            // Возвращаем успешный результат
            return array("success" => true);

        } catch (PDOException $e) {
            // Логирование или обработка ошибок должным образом
            return array("error" => "Ошибка подключения к базе данных: " . $e->getMessage());
        } finally {
            $conn = null;
        }
    }
}

?>
