<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

include __DIR__ . "/../dbConnect.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$title_id = $data["title_id"] ?? "";

if ($title_id === "") {
    echo json_encode(["success" => false, "error" => "Missing title_id"]);
    exit();
}

$stmt = $conn->prepare("
    SELECT avg_rating, COALESCE(num_votes, 0) AS num_votes
    FROM ratings
    WHERE title_id = ?
");
$stmt->bind_param("s", $title_id);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    echo json_encode([
        "success" => true,
        "avg_rating" => $row["avg_rating"],
        "num_votes" => $row["num_votes"]
    ]);
} else {
    echo json_encode([
        "success" => true,
        "avg_rating" => null,
        "num_votes" => 0
    ]);
}