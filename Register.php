<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit();
}

include __DIR__ . "/../dbConnect.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$username = $data["username"] ?? "";
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

if (!$username || !$email || !$password) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit();
}

// Check if taken
$check = $conn->prepare("SELECT user_id FROM users WHERE username = ? OR email = ?");
$check->bind_param("ss", $username, $email);
$check->execute();
$res = $check->get_result();

if ($res->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Username or email already exists"]);
    exit();
}

// Hash password
$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $hash);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "user_id" => $stmt->insert_id]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}
?>