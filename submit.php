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
else { // known device list
    $knownDevices = fopen("known.json", "w") or die("Can't open file, check permissions");
    fwrite($knownDevices,json_encode($data));
}

?> 