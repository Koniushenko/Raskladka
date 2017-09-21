<?php



$servername = "localhost";
$username = "kokon_raskladka";
$password = "kozlova1973";
$dbname = 'kokon_raskladka';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
    $_POST = json_decode(file_get_contents('php://input'), true);

$tripName = $_POST['tripName'];
// if ($tripName === '') echo ("Нет данных для записи!");
// else {
	try {
	    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password,
		array(
		    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
		  ));
		$conn->beginTransaction();	   
	    $stmt = $conn->prepare("SELECT ID FROM tripinfo WHERE tripName='$tripName'");
	    $stmt->execute();
	    $arrayID = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

	    // if (!empty($arrayID)) {
	    	// echo 'Такой поход есть:'.$tripName.' , удаляю...';
    	$tripID = $arrayID[0];
    	$sql = "DELETE from tripinfo WHERE ID = '$tripID'";
    	$conn->exec($sql);
    	$sql = "DELETE FROM menu WHERE tripID = '$tripID'";
	    $conn->exec($sql);
	    $sql = "DELETE FROM products WHERE tripID = '$tripID'";
	    $conn->exec($sql);
	    $sql = "DELETE FROM members WHERE tripID = '$tripID'";
	    $conn->exec($sql);
	    $sql = "DELETE FROM equipment WHERE tripID = '$tripID'";
	    $conn->exec($sql);	
	    $sql = "DELETE FROM measweights WHERE tripID = '$tripID'";
	    $conn->exec($sql);	
	    $sql = "DELETE FROM productstotal WHERE tripID = '$tripID'";
	    $conn->exec($sql);	
	    $sql = "DELETE FROM traintotal WHERE tripID = '$tripID'";
	    $conn->exec($sql);	 
	    // }
	    // else    
	    // 	echo 'Такого похода нет: '.$tripName.' ничего не удалял!';  	  
		
	    $conn->commit();  
	    
	}
	catch(PDOException $e) {
	    $conn->rollback();
	    echo "Connection failed: " . $e->getMessage();
	}
	$conn = null;
// }
?>