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

$user_id = isset($data['user_id']) ? intval($data['user_id']) : null;

if (!$user_id) {
    echo json_encode(["success" => false, "error" => "Missing user_id"]);
    exit();
}

$stmt = $conn->prepare("
    SELECT 
        m.title_id,
        m.title,
        m.release_year,
        m.title_type,
        m.poster,
        m.backdrop
    FROM userfavorites uf
    JOIN movies m ON uf.title_id = m.title_id
    WHERE uf.user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$favorites = [];

while ($row = $result->fetch_assoc()) {
    $favorites[] = $row;
}

echo json_encode([
    "success" => true,
    "favorites" => $favorites
]);
?>