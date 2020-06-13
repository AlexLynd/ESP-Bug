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

?> 