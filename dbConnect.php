<?php

    $host = "127.0.0.1";
    $user = "root";
    $pass = "8Jy4o04h?"; 
    $db   = "MovieMunchers";

    $conn = new mysqli($host, $user, $pass, $db);

    if ($conn->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }

    function selectQuery($sql) {
        global $conn;
        $result = $conn->query($sql);

        if (!$result) {
            return ["error" => $conn->error];
        }

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        return $data;
    }

    function modifyQuery($sql) {
        global $conn;
        if ($conn->query($sql) === TRUE) {
            return ["success" => true];
        } else {
            return ["error" => $conn->error];
        }
    }

?>
