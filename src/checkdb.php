<?php
$servername = "localhost";
$username = "kokon_raskladka";
$password = "kozlova1973";
$dbname = 'kokon_raskladka';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
    $_POST = json_decode(file_get_contents('php://input'), true);

$tripName = $_POST['tripName'];
$tripPassword = $_POST['tripPassword'];
$res = '';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password,
    array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
      ));
   
    $stmt = $conn->prepare("SELECT tripName, tripPassword FROM tripinfo");
    $stmt->execute();

    $tripNames = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    $pos = array_search($tripName, $tripNames);
    if ($pos !== false) {
        $stmt = $conn->prepare("SELECT tripPassword FROM tripinfo");
        $stmt->execute();
        $tripPasswords = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        if ($tripPasswords[$pos] === $tripPassword) {
            $res = 'Есть такой поход!';
        }
        else $res = 'Пароль не совпадает!';
    }
    else {
        $res = 'Нет такого похода!';
    }
}

catch(PDOException $e)
    {
    
    echo "Connection failed: " . $e->getMessage();
    }
$conn = null;


echo $res;  

?>
 