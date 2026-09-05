<?php
require '../config/db.php';
$id = $_GET['id'];

$stmt = $conn->prepare('DELETE FROM users WHERE id = ?');
$stmt->bind_param('i', $id);
if($stmt->execute()){
    echo json_encode(['success' => true]);
}
else{
    echo json_encode(['error' => 'delete failed']);
}
?>