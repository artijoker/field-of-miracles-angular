<?php
require("./keys.php");

session_start();

setcookie(
    session_name(),
    session_id(),
    [
        'path' => '/',
        'secure' => true,
        'samesite' => 'None',
    ]
);

$gameData = [];

if (0 === count(array_diff(KEYS, array_keys($_SESSION)))) {
    foreach (KEYS as $key) {
        $gameData[$key] = $_SESSION[$key];
    }
}

echo json_encode($gameData);
