<?php
class Database
{
    private $pdo;

    public function __construct($file)
    {
        $this->pdo = new PDO("sqlite:".$file);
    }

    function reset_db()
    {
        $sql = file_get_contents($_SERVER["DOCUMENT_ROOT"]."/db.sql", true);
        $this->pdo->exec($sql);
    }

    function init_db()
    {
        $tables = $this->pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='loss';")->fetchAll();
        if (empty($tables))
            $this->reset_db();
    }

    function select_branch_offices()
    {
        $query_result = $this->pdo->query("SELECT * FROM branch_office ORDER BY id ASC;");
        return $query_result ->fetchAll(PDO::FETCH_ASSOC);
    }

    function select_heating_substations()
    {
        $query_result = $this->pdo->query("SELECT * FROM heating_substation ORDER BY id ASC;");
        return $query_result ->fetchAll(PDO::FETCH_ASSOC);
    }

    function get_loss($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM loss WHERE loss.id = ?;");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    function select_losses()
    {
        $query_result = $this->pdo->query("SELECT * FROM loss ORDER BY id DESC;");
        return $query_result ->fetchAll(PDO::FETCH_ASSOC);
    }

    function insert_loss($data)
    {
        $heating_substation_id = $data["heating_substation_id"];
        $amount = $data["amount"];
        $current_iso_datetime = date("c");
        $stmt = $this->pdo->prepare("INSERT INTO loss (heating_substation_id, amount, datetime) VALUES (?, ?, ?) RETURNING *;");
        $stmt->execute([$heating_substation_id, $amount, $current_iso_datetime]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    function update_loss($id, $data)
    {
        $heating_substation_id = $data["heating_substation_id"];
        $amount = $data["amount"];
        $stmt = $this->pdo->prepare("UPDATE loss SET heating_substation_id=?, amount=? WHERE id=? RETURNING *;");
        $stmt->execute([$heating_substation_id, $amount, $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    function delete_loss($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM loss WHERE id=?;");
        $stmt->execute([$id]);
    }
}

$db = new Database($_SERVER["DOCUMENT_ROOT"]."/db.db");
$db->init_db();

