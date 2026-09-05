<?php
$conn = new mysqli("localhost", "root", "", "emc-system-v1");

if($conn->connect_error){
    die("connection failed");
}
?>