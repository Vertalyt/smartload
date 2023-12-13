<?php
// cors.php

// Определение допустимых источников (origins)
$allowed_origins = [
    'http://localhost:5173',
    // Добавьте другие допустимые источники при необходимости
];

// Проверка, является ли текущий источник допустимым
$current_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Разрешаем только запросы с допустимых источников
if (in_array($current_origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $current_origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}

// Если это запрос OPTIONS, завершаем скрипт
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die('OK');
}
?>
