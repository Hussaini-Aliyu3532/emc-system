<?php
require '../config/db.php';
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['fullName'])) {
    $id = $data['id'];
    $fullName = $data['fullName'];
    $email = $data['email'];
    $role = $data['role'];

    if (!empty($data['password'])) {
        $password = $data['password'];
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "UPDATE users SET fullName = ?, email = ?, role = ?, password = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            die($conn->error);
        }

        $stmt->bind_param('ssssi', $fullName, $email, $role, $hashedPassword, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => 'user updates successfully']);
        } else {
            echo json_encode(['error' => 'update faild']);
        }
    } else {
        $sql = "UPDATE users SET fullName = ?, email = ?, role = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            die($conn->error);
        }

        $stmt->bind_param('sssi', $fullName, $email, $role, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => 'user updates successfully']);
        } else {
            echo json_encode(['error' => 'update faild']);
        }
    }
} else if (isset($data['status'])) {
    $id = $data['id'];
    $status = $data['status'];

    $stmt = $conn->prepare("UPDATE users SET status = ? WHERE id = ?");

    if (!$stmt) {
        die($conn->error);
    }

    $stmt->bind_param('si', $status, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'status change detected']);
    } else  echo json_encode(['error' => 'update faild']);
} else {
    echo json_encode([
        'error' => 'invalid update'
    ]);
}
