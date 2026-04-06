<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
  echo json_encode(["success" => false, "error" => "Method not allowed"]);
  exit();
}

include __DIR__ . "/../dbConnect.php";

$sql = "SELECT genre_id, genre_name FROM genres WHERE genre_name != 'Adult' ORDER BY genre_name ASC";
$result = $conn->query($sql);

if (!$result) {
  echo json_encode(["success" => false, "error" => $conn->error]);
  exit();
}

$rows = [];
while ($row = $result->fetch_assoc()) {
  $rows[] = $row;
}

echo json_encode(["success" => true, "genres" => $rows]);