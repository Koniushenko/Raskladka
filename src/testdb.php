<?php
$servername = "localhost";
$username = "kokon_raskladka";
$password = "kozlova1973";
$dbname = 'kokon_raskladka';

function stringArray($m1, $m2) {
    return '"'.$m1.'", "'.$m2.'"';
};

function buildMenu($menuName, $id, $connect) {
    $mnNm = $menuName;
    $stmt = $connect->prepare("SELECT number, times FROM menu WHERE tripID='$id' AND name='$menuName'");
    $stmt->execute();

    switch ($menuName) {
        case 'Завтрак':
            $result =  '"breakfasts": [';
            break;
        case 'перекус':
            $result =  '"lunches": [';
            break;
        case 'ужин':
            $result =  '"dinners": [';
            break;        
        default:
            $result =  '"train": [';
            break;
    }
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $result .=  '{"number":'.$row['number'].', "times":'.$row['times'].', "meals":[';
        $row_number = $row['number'];
        $stmt2 = $connect->prepare("SELECT prodName, maleNorm, femaleNorm, measure FROM products 
                WHERE tripID='$id' AND menuName='$menuName' AND menuNumber=$row_number");
        $stmt2->execute(); 
        while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
            $result .= '{"name": "'.$row2['prodName'].'", "maleNorm":'.$row2['maleNorm'].
            ', "femaleNorm":'.$row2['femaleNorm'].', "measure": "'.$row2['measure'].'"}, ';
        }
        $result = substr($result, 0, -2).']}, ';

    }
    $result = substr($result, 0, -2).']';
    return $result;
};

$tripName = $_GET['tripName'];

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password,
    array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
      ));
  
    $stmt = $conn->prepare("SELECT ID FROM tripinfo WHERE tripName='$tripName'");
    $stmt->execute();
    $arrayID = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    $tripID = $arrayID[0];

    $stmt = $conn->prepare("SELECT * FROM tripinfo WHERE ID='$tripID'");
    $stmt->execute();
    $res = '';
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))  { 
        $row['tripMembers'] = (int) $row['tripMembers'];
        $row['tripNights'] = (int) $row['tripNights'];
        // $row['tripDate'] = strtotime($row['tripDate']);
        $res .= json_encode($row);
    }
    $stmt = $conn->prepare("SELECT * FROM measures");
    $stmt->execute();
    $row = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);   
    $stringRow = '"'.implode('", "', $row).'"';    
    $measures = '"measures": ['.$stringRow.']';

    $stmt = $conn->prepare("SELECT * FROM members WHERE tripID='$tripID'");
    $stmt->execute();
    $members = '[';
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))  { 
        $row['noEat'] = unserialize($row[noEat]);
        $row['equipWeight'] = (float) $row['equipWeight'];
        $row['foodWeight'] = (float) $row['foodWeight'];
        $row['number'] = (int) $row['number'];
        $row['eat'] = (bool) $row['eat'];
        $row['addCost'] = (float) $row['addCost'];
        $members .= json_encode($row).', ';
    } 
    $members = substr($members, 0, -2).']';

    $stmt = $conn->prepare("SELECT * FROM equipment WHERE tripID='$tripID'");
    $stmt->execute();
    $equipment = '[';
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))  { 
        $row['equipWeight'] = (float) $row['equipWeight'];
        $row['cost'] = (float) $row['cost'];
        $equipment .= json_encode($row).', ';
    } 
    if ($equipment == '[') { $equipment = '[]'; }
    else { $equipment = substr($equipment, 0, -2).']'; }
   
    $stmt = $conn->prepare("SELECT mweights FROM measweights WHERE tripID='$tripID'");
    $stmt->execute();
    $row = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    $measweights = $row[0];

    $stmt = $conn->prepare("SELECT * FROM productstotal WHERE tripID='$tripID'");
    $stmt->execute();
    $productsTotal = '[';
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))  { 
        $row['correctWeight'] = (float) $row['correctWeight'];
        $row['diffWeight'] = (float) $row['diffWeight'];
        $row['cost'] = (float) $row['cost'];
        $productsTotal .= json_encode($row).', ';
    } 
    if ($productsTotal == '[') { $productsTotal = '[]'; }
    else { $productsTotal = substr($productsTotal, 0, -2).']'; }

    $stmt = $conn->prepare("SELECT * FROM traintotal WHERE tripID='$tripID'");
    $stmt->execute();
    $trainTotal = '[';
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))  { 
        $row['cost'] = (float) $row['cost'];
        $trainTotal .= json_encode($row).', ';
    } 
    if ($trainTotal == '[') { $trainTotal = '[]'; }
    else { $trainTotal = substr($trainTotal, 0, -2).']'; }

    $breakfasts = buildMenu('Завтрак', $tripID, $conn);
    $lunches = buildMenu('перекус', $tripID, $conn);
    $dinners = buildMenu('ужин', $tripID, $conn);
    $train = buildMenu('поезд', $tripID, $conn);

    $res = '{"tripInfo": '.$res.', "membersInfo": '.$members.', "equipment": '.$equipment.', "measWeights": '.$measweights.', '
    .$breakfasts.', '.$lunches.', '.$dinners.', '.$train.', '.$measures.', "productsTotal": '.$productsTotal.
    ', "trainTotal": '.$trainTotal.'}';	   

}

catch(PDOException $e)
    {    
    echo "Connection failed: " . $e->getMessage();
    }
$conn = null;

echo $res;  

?>
