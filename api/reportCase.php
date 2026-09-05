<?php
require "../config/db.php";
session_start();

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["error" => "true"]);
    exit;
}
$student_id = $data['student_id'];
$course_id = $data['course_id'];
$venue = $data['venue'];
$exam_date = $data['exam_date'];
$exam_time = $data['exam_time'];
$misconduct_type = $data['misconduct_type'];
$description = $data['description'];

$repoted_by = $_SESSION['user_id'];

$case_id = "EMC-" . Date('YmdHis');

$stmt = $conn->prepare("
INSERT INTO cases(
case_id,
student_id,
course_id,
venue,
exam_date,
exam_time,
misconduct_type,
description,
reported_by
)
VALUES(?,?,?,?,?,?,?,?,?)
");

$stmt->bind_param('siisssssi',
    $case_id, 
    $student_id, 
    $course_id, 
    $venue, 
    $exam_date, 
    $exam_time, 
    $misconduct_type, 
    $description, 
    $repoted_by
);

if ($stmt->execute()){
    echo json_encode([
        'success' => true,
        'message' => 'Case reported successfully',
        'case_id' => $case_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to report case'
    ]);
}