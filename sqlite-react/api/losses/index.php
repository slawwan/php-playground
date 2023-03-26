<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");

require_once($_SERVER["DOCUMENT_ROOT"] . "/database.php");

global $db;
$params = [];
parse_str($_SERVER["QUERY_STRING"] ?? "", $params);

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $id = $params["id"] ?? NULL;

    if ($id) {
        $loss = $db->get_loss($id);
        header("Content-Type: application/json");
        echo json_encode($loss);
        exit();
    }

    $losses = $db->select_losses();
    header("Content-Type: application/json");
    echo json_encode($losses);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $params["id"] ?? NULL;

    $loss = $id ? $db->update_loss($id, $data) : $db->insert_loss($data);

    header("Content-Type: application/json");
    echo json_encode($loss);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $db->delete_loss($params["id"]);
    exit();
}

