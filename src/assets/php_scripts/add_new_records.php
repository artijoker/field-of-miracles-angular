<?php

$pdo = new PDO(
    "mysql:host=127.0.0.1:3306;dbname=fieldofmiracles",
    "root",
    "56537",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING]
);

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data["name"]) && isset($data["score"])) {
    $sql = "insert into records values(null, :name, :score )";
    $request = $pdo->prepare($sql);
    $request->execute(
        [
            ":name" => $data["name"],
            ":score" => $data["score"]
        ]
    );

    $sql = "select * from records";
    $request = $pdo->prepare($sql);
    $request->execute();
    $records = $request->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($records);
}
