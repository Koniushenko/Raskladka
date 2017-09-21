<?php
$servername = "localhost";
$username = "kokon_raskladka";
$password = "kozlova1973";
$dbname = 'kokon_raskladka';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
    $_POST = json_decode(file_get_contents('php://input'), true);

$tripName = $_POST['tripName'];
if ($tripName === '') echo ("Нет данных для записи!");
else {	
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
	    if ( !empty($arrayID)) {
	    	// echo 'Такой поход есть:'.$tripName;
	    	$tripID = $arrayID[0];
	    	$member = json_decode($_POST['member']);
	    	$number = $member->number;
	    	$noEat = serialize($member->noEat);
	    	$stmt = $conn->prepare("SELECT name FROM members WHERE tripID = '$tripID' AND number = '$number'");
	    	$stmt->execute();
	    	if ($stmt->rowCount() == 0) { echo "Не нашелся такой участник в этом походе ".$tripID." | ".$number;}
	    	else {
		    	$stmt = $conn->prepare("UPDATE members SET name = '$member->name', phone = '$member->phone', sex = '$member->sex',
		    		eat = '$member->eat', noEat = '$noEat' WHERE tripID = '$tripID' AND number = '$number'");
		    	// $stmt = $conn->prepare("SELECT COUNT(number) FROM members WHERE tripID='$tripID'");
		    	$stmt->execute();
		    	// $updatedInfo = $stmt->rowCount();
		    	$memberExpenses = json_decode($_POST['memberExpenses']);
		    	$tmp = (array)$memberExpenses;
		    	if (!empty($tmp)) {
		    		// echo $_POST['memberExpenses']; 	
			    	$sql = "UPDATE members SET addCost = '$memberExpenses->addCost', addCostNote = '$memberExpenses->addCostNote' 
			    	WHERE tripID = '$tripID' AND number = '$number'";
			    	$conn->exec($sql); 
			    	$memberEquip = $memberExpenses->equipment;
			    	foreach ($memberEquip as $key => $eqInfo) {
			    		$sql = "UPDATE equipment SET cost = '$eqInfo->cost'	WHERE tripID = '$tripID' AND berun = '$number' 
			    		AND equipName = '$eqInfo->name'";
				    	$conn->exec($sql); 
			    	}
			    	$memberFood = $memberExpenses->food;
			    	foreach ($memberFood as $key => $foodInfo) {
			    		$sql = "UPDATE productstotal SET cost = '$foodInfo->cost'	WHERE tripID = '$tripID' AND berun = '$number' 
			    		AND name = '$foodInfo->name'";
				    	$conn->exec($sql); 
			    	}
			    	$memberTrain = $memberExpenses->trainFood;
			    	foreach ($memberTrain as $key => $trainInfo) {
			    		$sql = "UPDATE traintotal SET cost = '$trainInfo->cost'	WHERE tripID = '$tripID' AND berun = '$number' 
			    		AND name = '$trainInfo->name'";
				    	$conn->exec($sql); 
			    	}
			    }
		    	echo "Обновили данные по участнику ".$member->name;	 

	    	}

		    	   	
		    	// else {echo "Ничего нового не записали...";}
	    
	    }
	    else {echo 'Такой поход еще не записан!'.$tripName;}
	    $conn->commit();
	}
	catch(PDOException $e) {
	    $conn->rollback();
	    echo "Connection failed: " . $e->getMessage();
	}
	$conn = null;
}
?>