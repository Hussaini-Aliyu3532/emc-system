<?php
session_start();
header('content-Type: application/json');

if(isset($_SESSION['user_id'])){
    echo json_encode([
        'loggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'fullName' => $_SESSION['fullName'],
            'role' => $_SESSION['role'],
            'status' => $_SESSION['status']
        ]
    ]);
} else {
    echo json_encode([
        'loggedIn' => false
    ]);
}
?>