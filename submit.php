<?php 
  
header("Content-Type: application/json"); 
$data = json_decode(file_get_contents("php://input"));
  
if ($data->clients) { 
    $clients = fopen("clients.json", "w") or die("Can't open file, check permissions");
    fwrite($clients,json_encode($data));
}
else if ($data->networks) {    
    $networks = fopen("networks.json", "w") or die("Can't open file, check permissions");
    fwrite($networks,json_encode($data));
}
else if ($data->delete) {
    $i=0;$array=array();
	
	$read = fopen("known.csv", "r") or die("can't open the file");
	while(!feof($read)) {
		$array[$i] = fgets($read);	
		++$i;
	}
	fclose($read);
	
	$write = fopen("known.csv", "w") or die("can't open the file");
	foreach($array as $a) {
		if(!strstr($a,$data->delete->bssid)) fwrite($write,$a);
	}
    fclose($write);
    
    //echo $data->delete->bssid;
    //deleteLineInFile("known.csv","dev");
}
else if ($data[0]->name) {  // known devices 
    $known = fopen("known.csv", "a+") or die("Can't open file, check permissions");
    foreach ($data as $key => $jsons) {
        foreach($jsons as $key => $value) {
            if ($key == "bssid" && !strpos(file_get_contents("known.csv"),$value)){ fwrite($known,$value.","); }
            else if ($key == "bssid" && strpos(file_get_contents("known.csv"),$value)) {break;}
            else { fwrite($known, $value."\n"); }
        }
    }
}





function deleteLineInFile($file,$string)
{
	$i=0;$array=array();
	
	$read = fopen($file, "r") or die("can't open the file");
	while(!feof($read)) {
		$array[$i] = fgets($read);	
		++$i;
	}
	fclose($read);
	
	$write = fopen($file, "w") or die("can't open the file");
	foreach($array as $a) {
		if(!strstr($a,$string)) fwrite($write,$a);
	}
	fclose($write);
}



?> 