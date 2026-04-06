<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") exit();

include __DIR__ . "/../dbConnect.php";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$q_raw = trim($data["query"] ?? "");
$genre_id = intval($data["genre_id"] ?? 0);
$type = trim($data["type"] ?? "");
$limit = 50;
$offset = max(0, intval($data["offset"] ?? 0));

try {
    $joins = "";
    $wheres = [];
    $params = [];
    $types = "";

    if ($genre_id > 0) {
        $joins .= " JOIN moviegenres mg ON mg.title_id = m.title_id ";
        $wheres[] = "mg.genre_id = ?";
        $params[] = $genre_id;
        $types .= "i";
    }

    if ($type === "movie" || $type === "tvSeries") {
        $wheres[] = "m.title_type = ?";
        $params[] = $type;
        $types .= "s";
    }

    if ($q_raw !== "") {
        $wheres[] = "m.title LIKE ?";
        $params[] = $q_raw . "%";
        $types .= "s";
    }

    $adult_genre_id = 28;
    $wheres[] = "NOT EXISTS (
        SELECT 1 FROM moviegenres mg2 
        WHERE mg2.title_id = m.title_id 
        AND mg2.genre_id = ?
    )";
    $params[] = $adult_genre_id;
    $types .= "i";

    $sql = "SELECT 
                m.title_id,
                m.title,
                m.release_year,
                m.title_type,
                m.poster,
                m.backdrop,
                COALESCE(r.avg_rating,0) AS avg_rating,
                COALESCE(r.num_votes,0) AS num_votes
            FROM movies m
            LEFT JOIN ratings r ON r.title_id = m.title_id
            $joins";

    if (!empty($wheres)) {
        $sql .= " WHERE " . implode(" AND ", $wheres);
    }

    $sql .= " LIMIT ? OFFSET ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);

    $types .= "ii";
    $params[] = $limit;
    $params[] = $offset;

    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $row["avg_rating"] = (float)$row["avg_rating"];
        $row["num_votes"] = (int)$row["num_votes"];
        $rows[] = $row;
    }

    echo json_encode([
        "success" => true,
        "results" => $rows,
        "offset" => $offset,
        "limit" => $limit
    ]);

} catch (Throwable $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
