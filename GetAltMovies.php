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
$title_id = $data["title_id"] ?? "";

if ($title_id === "") {
    echo json_encode(["success" => false, "error" => "Missing title_id"]);
    exit();
}

$stmt = $conn->prepare("
    SELECT alt_title, region
    FROM altmovies
    WHERE title_id = ?
    ORDER BY region ASC, alt_title ASC
    LIMIT 20
");
$stmt->bind_param("s", $title_id);
$stmt->execute();
$res = $stmt->get_result();

$alt_titles = [];
while ($row = $res->fetch_assoc()) {
    $alt_titles[] = [
        "title" => $row["alt_title"],
        "region" => $row["region"]
    ];
}

$stmt->close();

echo json_encode([
    "success" => true,
    "alt_titles" => $alt_titles
]);
?>
