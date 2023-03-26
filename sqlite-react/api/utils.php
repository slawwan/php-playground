<?php

function exit_with_json_response($data): void
{
    header("Content-Type: application/json");
    echo json_encode($data);
    exit();
}

function use_cors_hack_for_dev_mode(): void
{
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
}

function parse_query_params(): array
{
    $params = [];
    parse_str($_SERVER["QUERY_STRING"] ?? "", $params);
    return $params;
}
