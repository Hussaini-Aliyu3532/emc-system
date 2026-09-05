<?php

use Dom\Mysql;

require "../config/db.php";
session_start();

$stmt = $conn->prepare("
    SELECT * FROM cases ORDER BY created_at DESC
");

$stmt->execute();

$result = $stmt->get_result();

$cases = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($cases);
?>