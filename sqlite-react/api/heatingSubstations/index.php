<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");

require_once($_SERVER["DOCUMENT_ROOT"] . "/database.php");

global $db;

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $data = $db->select_heating_substations();
    header("Content-Type: application/json");
    echo json_encode($data);
    exit();
}
?>
