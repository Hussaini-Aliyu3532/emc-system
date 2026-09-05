<?php
require "../config/db.php";
header("content-Type: application/json");

$faculty_id = $_GET["faculty_id"] ?? null;

if(!$faculty_id){
    echo json_encode([]);
    exit;
}

$sql = "SELECT id, name from departments WHERE faculty_id = ? ORDER BY name";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $faculty_id);
$stmt->execute();

$result = $stmt->get_result();
$departments = [];

while ($row = $result->fetch_assoc()) {
    $departments[] = $row;
}

echo json_encode($departments);
?>