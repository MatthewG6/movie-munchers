<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include __DIR__ . "/../dbConnect.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$username = $data['username'] ?? "";
$password = $data['password'] ?? "";

if ($username === "" || $password === "") {
    echo json_encode(["success" => false, "error" => "Missing credentials"]);
    exit();
}

$stmt = $conn->prepare("SELECT user_id, password_hash FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$response = ["success" => false];

if ($row = $result->fetch_assoc()) {

    // ---> IMPORTANT FIX
    if (password_verify($password, $row["password_hash"])) {
        $response["success"] = true;
        $response["user_id"] = $row["user_id"];
    }
}

echo json_encode($response);
?>
