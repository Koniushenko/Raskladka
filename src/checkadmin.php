<?php
$servername = "localhost";
$username = "kokon_raskladka";
$password = "kozlova1973";
$dbname = 'kokon_raskladka';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
    $_POST = json_decode(file_get_contents('php://input'), true);

$userLogin = $_POST['login'];
$userPassword = $_POST['password'];
$userIsAdmin = $_POST['admin'];
$res = '';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password,
    array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
      ));
   
    $stmt = $conn->prepare("SELECT login FROM admins");
    $stmt->execute();
    $logins = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    $pos = array_search($userLogin, $logins);
    if ($pos !== false) {
        if ($userIsAdmin) {            
            $stmt = $conn->prepare("SELECT password FROM admins");
            $stmt->execute();
            $passwords = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
            if ($passwords[$pos] === $userPassword) {
                $res = "Добро пожаловать!";
            }
            else $res = 'Пароль не совпадает!';
        }
        else $res = 'Такой админ уже есть!';
    }
    else {
        if (!$userIsAdmin) {
            $stmt = $conn->prepare("INSERT INTO admins(login, password) VALUES('$userLogin', '$userPassword')");
            $stmt->execute();
            $res = "Вы зарегистрировались!";
        }
        else $res = 'Нет такого админа!';        
    }
}
catch(PDOException $e)
    {
    
    echo "Connection failed: " . $e->getMessage();
    }
$conn = null;
echo $res;  

?>
 