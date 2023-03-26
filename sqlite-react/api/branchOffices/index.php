<?php

require_once($_SERVER["DOCUMENT_ROOT"] . "/database.php");
require_once($_SERVER["DOCUMENT_ROOT"] . "/api/utils.php");

global $db;

use_cors_hack_for_dev_mode();

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $data = $db->select_branch_offices();
    exit_with_json_response($data);
}
