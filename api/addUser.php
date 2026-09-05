<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
if(!$data){
    echo json_encode(['error' => 'no data received yet']);
    exit;
}



$fullName = $data['fullName'];
$email = $data['email'] ?? null;
$matrix = $data['matrix'] ?? null;
$role = $data['role'];
$status = $data['status'];
$hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

if($email !== null){
    $sql = 'INSERT INTO users(fullName, email, matrix, password, status, role) VALUES(?, ?, ?, ?, ?, ?)';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssss', $fullName, $email, $matrix, $hashedPassword, $status, $role);

    if($stmt->execute()){
        echo json_encode([
            "id" => $stmt->insert_id,
            "fullName" => $fullName,
            "email" => $email,
            "matrix" => $matrix,
            "status" => $status,
            "role" => $role,
            "created_at" => date('Y-m-d H:i:s')
        ]);
    }
}

if($matrix !== null){
    $sql = 'INSERT INTO users(fullName, email, matrix, password, status, role) VALUES(?,?, ?, ?, ?, ?)';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssss', $fullName, $email, $matrix, $hashedPassword, $status, $role);

    if($stmt->execute()){
        echo json_encode([
            "id" => $stmt->insert_id,
            "fullName" => $fullName,
            "email" => $email,
            "matrix" => $matrix,
            "status" => $status,
            "role" => $role,
            "created_at" => date('Y-m-d H:i:s')
        ]);
    }
}
?>