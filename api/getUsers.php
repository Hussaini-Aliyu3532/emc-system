<?php
require '../config/db.php';

// 1. Check if an admin exists directly in the database
$checkAdmin = $conn->prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
$checkAdmin->execute();
$result = $checkAdmin->get_result();

// 2. If no admin exists, insert the default one immediately!
if($result->num_rows === 0) {
    $createAdmin = $conn->prepare("INSERT INTO users(fullName, email, password, status, role) VALUES(?, ?, ?, ?, ?)");
    $fullName = 'System Admin';
    $email = 'admin@emc.com';
    $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT); // or however you store passwords
    $status = 'active';
    $role = 'admin';

    $createAdmin->bind_param('sssss', $fullName, $email, $hashedPassword, $status, $role);
    $createAdmin->execute();
}

$sql = 'SELECT * FROM users';
$result = $conn->query($sql);
$users = [];

while($row = $result->fetch_assoc()){
    $users[] = $row;
}

echo json_encode($users);
?>