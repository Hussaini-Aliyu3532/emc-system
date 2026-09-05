<?php
require "../config/db.php";
header("content-Type: application/json");

$sql = "SELECT id, name from faculties ORDER BY name";

$result = $conn->query($sql);
$faculties = [];

while ($row = $result->fetch_assoc()) {
    $faculties[] = $row;
}

echo json_encode($faculties);
?>