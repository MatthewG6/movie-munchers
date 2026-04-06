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

$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : 0;
$title_id = isset($data["title_id"]) ? trim($data["title_id"]) : "";

if ($user_id <= 0 || $title_id === "") {
    echo json_encode(["success" => false, "error" => "Missing user_id or title_id"]);
    exit();
}

$stmt = $conn->prepare("INSERT INTO userfavorites (user_id, title_id) VALUES (?, ?)");
$stmt->bind_param("is", $user_id, $title_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "added" => true]);
    exit();
}

// Duplicate favorite (because you added PK (user_id, title_id))
if ($conn->errno === 1062) {
    echo json_encode(["success" => true, "added" => false, "message" => "Already favorited"]);
    exit();
}

// Foreign key failure (user_id missing in users, or title_id missing in movies)
echo json_encode([
    "success" => false,
    "error" => $conn->error,
    "errno" => $conn->errno
]);
exit();