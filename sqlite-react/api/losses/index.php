<?php

require_once($_SERVER["DOCUMENT_ROOT"] . "/database.php");
require_once($_SERVER["DOCUMENT_ROOT"] . "/api/utils.php");

global $db;

use_cors_hack_for_dev_mode();

$params = parse_query_params();

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $id = $params["id"] ?? NULL;

    if ($id) {
        $loss = $db->get_loss($id);
        exit_with_json_response($loss);
    }

    $losses = $db->select_losses();
    exit_with_json_response($losses);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $params["id"] ?? NULL;
    $data = json_decode(file_get_contents("php://input"), true);
    $loss = $id ? $db->update_loss($id, $data) : $db->insert_loss($data);
    exit_with_json_response($loss);
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $db->delete_loss($params["id"]);
    exit();
}
