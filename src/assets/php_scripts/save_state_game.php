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

$data = json_decode(file_get_contents("php://input"), true);

if (count(array_diff(KEYS, array_keys($data))) === 0) {
    foreach (KEYS as $key) {
        $_SESSION[$key] = $data[$key];
    }
}
