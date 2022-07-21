<?php
session_start();
unset($_SESSION['name']);
session_destroy();
setcookie(
    session_name(),
    "",
    [
        'path' => '/',
        'secure' => true,
        'samesite' => 'None',
    ]
);
