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

$directors = [];
$stmtD = $conn->prepare("
    SELECT n.primary_name
    FROM moviedirectors md
    JOIN names n ON md.name_id = n.name_id
    WHERE md.title_id = ?
    ORDER BY n.primary_name ASC
");
$stmtD->bind_param("s", $title_id);
$stmtD->execute();
$resD = $stmtD->get_result();
while ($row = $resD->fetch_assoc()) {
    if (!empty($row["primary_name"])) {
        $directors[] = $row["primary_name"];
    }
}
$stmtD->close();

$actors = [];
$stmtA = $conn->prepare("
    SELECT n.primary_name
    FROM movieactors ma
    JOIN names n ON ma.name_id = n.name_id
    WHERE ma.title_id = ?
    ORDER BY n.primary_name ASC
    LIMIT 10
");
$stmtA->bind_param("s", $title_id);
$stmtA->execute();
$resA = $stmtA->get_result();
while ($row = $resA->fetch_assoc()) {
    if (!empty($row["primary_name"])) {
        $actors[] = $row["primary_name"];
    }
}
$stmtA->close();

echo json_encode([
    "success" => true,
    "title_id" => $title_id,
    "directors" => $directors,
    "actors" => $actors
]);
?>