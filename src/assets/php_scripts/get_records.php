<?php
// $records = file_get_contents("records.json");

$pdo = new PDO(
    "mysql:host=127.0.0.1:3306;dbname=fieldofmiracles",
    "root",
    "56537",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING]
);

$sql = "select * from records";
$request = $pdo->prepare($sql);
$request->execute();
$records = $request->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($records);
