<?php
require'../config/db.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);

$password = $data['password'];
$identifier = $data['identifier'];

$stmt = $conn->prepare(
    'SELECT * FROM users WHERE email = ?'
);
$stmt->bind_param('s', $identifier);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if($user && password_verify($password, $user['password']) && $user['status'] === 'active'){
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['fullName'] = $user['fullName'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['status'] = $user['status'];
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'fullName' => $user['fullName'],
            'email' => $user['email'],
            'role' => $user['role'],
            'status' => $user['status']
        ]
    ]);
} else {
    echo json_encode([
        'success' => false
    ]);
}
?>