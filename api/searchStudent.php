<?php
require "../config/db.php";
$search = $_GET["q"] ?? '';
$search = "%$search%";

$stmt = $conn->prepare(
    "SELECT id, fullName, matrix from users 
    WHERE role = 'student'
    AND status = 'active'
    AND (fullName LIKE ? OR matrix LIKE ?)
    LIMIT 10"
);
$stmt->bind_param('ss', $search, $search);
$stmt->execute();

$result = $stmt->get_result();
$students = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($students);
?>