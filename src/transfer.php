<?php



$servername = "localhost";
$username = "kokon_raskladka";
$password = "kozlova1973";
$dbname = 'kokon_raskladka';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
    $_POST = json_decode(file_get_contents('php://input'), true);

$tripInfo = json_decode($_POST['tripInfo']);
if ($tripInfo->tripName === '') echo ("Нет данных для записи!");
else {
	$tripName = $tripInfo->tripName;
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
	    	echo 'Такой поход есть:'.$tripName.' , обновляю...';
	    	$tripID = $arrayID[0];
	    	$sql = "UPDATE tripinfo SET tripDescription = '$tripInfo->tripDescription', tripDate = '$tripInfo->tripDate', 
	    	stringDate = '$tripInfo->stringDate', stringTime = '$tripInfo->stringTime', tripMembers = '$tripInfo->tripMembers', 
	    	tripNights = '$tripInfo->tripNights', males = '$tripInfo->males', females = '$tripInfo->females', 
	    	alcoKoeff = '$tripInfo->alcoKoeff', emanKoeff = '$tripInfo->emanKoeff', tripPassword = '$tripInfo->tripPassword' 
	    	WHERE ID = '$tripID'";
	    	$conn->exec($sql);
	    	$last_id = $tripID;
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

	    }
	    else {	   
	    	echo 'Записываю новый поход: '.$tripName;
		    $sql = "INSERT INTO tripinfo(tripName, tripDescription, tripDate, stringDate, stringTime, tripMembers, tripNights, 
		    	males, females, alcoKoeff, emanKoeff, tripPassword)
		    VALUES('$tripInfo->tripName', '$tripInfo->tripDescription', '$tripInfo->tripDate', '$tripInfo->stringDate', 
		    '$tripInfo->stringTime', '$tripInfo->tripMembers', '$tripInfo->tripNights', '$tripInfo->males', '$tripInfo->females', 
		    '$tripInfo->alcoKoeff', '$tripInfo->emanKoeff', '$tripInfo->tripPassword')";
			$conn->exec($sql);
			$last_id = $conn->lastInsertId();			     
		}
		
	    foreach (json_decode($_POST['breakfasts']) as $index => $breakfast) {
	    		$number = $breakfast->number;    	
	    		$times = $breakfast->times;
	    		$meals = $breakfast->meals;
	    		$sql = "INSERT INTO menu(Name, Number, Times, tripID) 
	    		VALUES('завтрак', '$number', '$times', '$last_id')";
	    		$conn->exec($sql); 
	    		foreach ($meals as $key => $meal) {
	    			$sql = "INSERT INTO products(prodName, maleNorm, femaleNorm, measure, menuName, menuNumber, tripID)
	    					VALUES('$meal->name', '$meal->maleNorm', '$meal->femaleNorm', '$meal->measure', 'завтрак', '$number', '$last_id')";
	    			$conn->exec($sql); 
	    		}
	    		   	
	    }
	    foreach (json_decode($_POST['lunches']) as $index => $lunch) {
	    		$number = $lunch->number;    	
	    		$times = $lunch->times;
	    		$meals = $lunch->meals;
	    		$sql = "INSERT INTO menu(Name, Number, Times, tripID) 
	    		VALUES('перекус', '$number', '$times', '$last_id')";
	    		$conn->exec($sql);  
	    		foreach ($meals as $key => $meal) {
	    			$sql = "INSERT INTO products(prodName, maleNorm, femaleNorm, measure, menuName, menuNumber, tripID)
	    					VALUES('$meal->name', '$meal->maleNorm', '$meal->femaleNorm', '$meal->measure', 'перекус', '$number', '$last_id')";
	    			$conn->exec($sql); 
	    		}  	
	    }  
	    foreach (json_decode($_POST['dinners']) as $index => $dinner) {
	    		$number = $dinner->number;    	
	    		$times = $dinner->times;
	    		$meals = $dinner->meals;
	    		$sql = "INSERT INTO menu(Name, Number, Times, tripID) 
	    		VALUES('ужин', '$number', '$times', '$last_id')";
	    		$conn->exec($sql); 
	    		foreach ($meals as $key => $meal) {
	    			$sql = "INSERT INTO products(prodName, maleNorm, femaleNorm, measure, menuName, menuNumber, tripID)
	    					VALUES('$meal->name', '$meal->maleNorm', '$meal->femaleNorm', '$meal->measure', 'ужин', '$number', '$last_id')";
	    			$conn->exec($sql); 
	    		}    	
	    }   
	    $train = json_decode($_POST['train']);
	    $sql = "INSERT INTO menu(Name, Number, Times, tripID) 
	    		VALUES('поезд', 1, 1, '$last_id')";
	   	$conn->exec($sql); 
	    $trainMeals = $train[0]->meals;
	    foreach ($trainMeals as $index => $meal) {
	    	$sql = "INSERT INTO products(prodName, maleNorm, femaleNorm, measure, menuName, menuNumber, tripID)
	    					VALUES('$meal->name', '$meal->maleNorm', '$meal->femaleNorm', '$meal->measure', 'поезд', 1, '$last_id')";
	    	$conn->exec($sql); 
	    }

	    foreach (json_decode($_POST['membersInfo']) as $index => $member) {
	    	$noEat = serialize($member->noEat);
	    	$sql = "INSERT INTO members(number, name, phone, sex, eat, noEat, tripID, equipWeight)
	    	VALUES('$member->number', '$member->name', '$member->phone', '$member->sex', '$member->eat', '$noEat', '$last_id', 
	    	'$member->equipWeight')";
	    	$conn->exec($sql); 	    	
	    }

	    foreach (json_decode($_POST['equipmentInfo']) as $index => $eq) {
	    	$sql = "INSERT INTO equipment(equipName, equipWeight, berun, nesun, tripID)
	    	VALUES('$eq->equipName', '$eq->equipWeight', '$eq->berun', '$eq->nesun', '$last_id')";
	    	$conn->exec($sql);    	
	    }

		$measweights = $_POST['measWeights'];
		$sql = "INSERT INTO measweights(tripID, mweights) VALUES('$last_id', '$measweights')";
		$conn->exec($sql); 

		foreach (json_decode($_POST['allProducts']) as $key => $product) {
	    	$sql = "INSERT INTO productstotal(name, correctWeight, diffWeight, note, berun, tripID)
	    	VALUES('$product->name', '$product->correctWeight', ('$product->correctWeight' - '$product->totalWeight'),
	    	'$product->note', '$product->berun', '$last_id')";
	    	$conn->exec($sql);  
	    }

	    foreach (json_decode($_POST['trainProducts']) as $key => $product) {
	    	$sql = "INSERT INTO traintotal(name, note, berun, tripID)
	    	VALUES('$product->name', '$product->note', '$product->berun', '$last_id')";
	    	$conn->exec($sql);  
	    }

	    foreach (json_decode($_POST['readyRaskladka']) as $number => $data) { 
	    	$sql = "UPDATE members SET addCost = '$data->addCost', addCostNote = '$data->addCostNote' 
	    	WHERE tripID = '$last_id' AND number = '$number'";
	    	$conn->exec($sql); 
	    	$memberEquip = $data->equipment;
	    	foreach ($memberEquip as $key => $eqInfo) {
	    		$sql = "UPDATE equipment SET cost = '$eqInfo->cost'	WHERE tripID = '$last_id' AND berun = '$number' 
	    		AND equipName = '$eqInfo->name'";
		    	$conn->exec($sql); 
	    	}
	    	$memberFood = $data->food;
	    	foreach ($memberFood as $key => $foodInfo) {
	    		$sql = "UPDATE productstotal SET cost = '$foodInfo->cost'	WHERE tripID = '$last_id' AND berun = '$number' 
	    		AND name = '$foodInfo->name'";
		    	$conn->exec($sql); 
	    	}
	    	$memberTrain = $data->trainFood;
	    	foreach ($memberTrain as $key => $trainInfo) {
	    		$sql = "UPDATE traintotal SET cost = '$trainInfo->cost'	WHERE tripID = '$last_id' AND berun = '$number' 
	    		AND name = '$trainInfo->name'";
		    	$conn->exec($sql); 
	    	}

	    }

	    $conn->commit();  
	    echo 'записал в поход:'.$tripName.' все ОК!';
	}
	catch(PDOException $e) {
	    $conn->rollback();
	    echo "Connection failed: " . $e->getMessage();
	}
	$conn = null;
}
?>