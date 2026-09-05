<?php
require "../config/db.php";
header("content-Type: application/json");

$department_id = $_GET["department_id"] ?? null;

if (!$department_id){
    echo json_encode([]);
    exit;
}

$sql = "SELECT id, name FROM courses WHERE department_id = ? ORDER BY name";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $department_id);
$stmt->execute();

$result = $stmt->get_result();
$courses = [];

while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}
echo json_encode($courses);
?>