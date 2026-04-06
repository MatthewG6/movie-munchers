<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

include __DIR__ . "/../dbConnect.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$q = trim($data["query"] ?? "");
$type = trim($data["type"] ?? "");
$role = trim($data["role"] ?? "actor"); // default to actor

if ($q === "") {
    echo json_encode(["success" => false, "error" => "Missing query"]);
    exit();
}

// Prepare full-text search
$tokens = preg_split('/\s+/', $q);
$tokens = array_filter($tokens, fn($t) => $t !== "");
$bool = "";
foreach ($tokens as $t) {
    $t = preg_replace('/[^\p{L}\p{N}]/u', '', $t);
    if ($t !== "") $bool .= "+" . $t . "* ";
}
$bool = trim($bool);

// Search names
$matches = [];
$name_id = null;

if ($bool !== "") {
    $stmtN = $conn->prepare("
        SELECT name_id, primary_name
        FROM names
        WHERE MATCH(primary_name) AGAINST (? IN BOOLEAN MODE)
        LIMIT 5
    ");
    $stmtN->bind_param("s", $bool);
    $stmtN->execute();
    $resN = $stmtN->get_result();
    while ($row = $resN->fetch_assoc()) $matches[] = $row;
    $stmtN->close();
}

if (count($matches) === 0) {
    $stmtN2 = $conn->prepare("
        SELECT name_id, primary_name
        FROM names
        WHERE primary_name LIKE CONCAT('%', ?, '%')
        LIMIT 5
    ");
    $stmtN2->bind_param("s", $q);
    $stmtN2->execute();
    $resN2 = $stmtN2->get_result();
    while ($row = $resN2->fetch_assoc()) $matches[] = $row;
    $stmtN2->close();
}

if (count($matches) === 0) {
    echo json_encode([
        "success" => true,
        "person_matches" => [],
        "results" => []
    ]);
    exit();
}

$name_id = $matches[0]["name_id"];

// Determine table based on role
$table = $role === "director" ? "moviedirectors" : "movieactors";

$sql = "
    SELECT DISTINCT
        m.title_id,
        m.title,
        m.release_year,
        m.title_type,
        m.poster,
        m.backdrop,
        r.avg_rating,
        r.num_votes
    FROM $table t
    JOIN movies m ON t.title_id = m.title_id
    LEFT JOIN ratings r ON r.title_id = m.title_id
    WHERE t.name_id = ?
        AND (? = '' OR m.title_type = ?)
    ORDER BY COALESCE(r.num_votes, 0) DESC, m.release_year DESC
    LIMIT 50
";

$stmtT = $conn->prepare($sql);
$stmtT->bind_param("sss", $name_id, $type, $type);
$stmtT->execute();
$resT = $stmtT->get_result();

$rows = [];
while ($row = $resT->fetch_assoc()) $rows[] = $row;

echo json_encode([
    "success" => true,
    "person_matches" => $matches,
    "picked_person" => $matches[0],
    "results" => $rows
]);
?>
