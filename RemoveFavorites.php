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

$user_id  = isset($data['user_id']) ? intval($data['user_id']) : null;
$title_id = isset($data['title_id']) ? $data['title_id'] : "";

if (!$user_id || !$title_id) {
    echo json_encode(["success" => false, "error" => "Missing user_id or title_id"]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM userfavorites WHERE user_id = ? AND title_id = ?");
$stmt->bind_param("is", $user_id, $title_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Favorite removed"]);
} else {
    echo json_encode(["success" => false, "message" => "Not found"]);
}
?>