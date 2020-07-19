#include "./esppl_functions.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "MySpectrumWiFi8E-2G";
const char* password = "anyplayer857";
const char* serverName = "http://192.168.1.9:80/submit.php";

unsigned long progTime;

unsigned long prevTime = 0;   // last update
const long interval = 30000;  // JSON update interval 

String networks[20][4]; int netCount = 0;
String clients[50][4]; int clientCount = 0;

const int knownCount = 2;

String known[knownCount][2] = {
  {"ec:a9:40:57:41:8f","Alex"},
  {"14:b7:f8:f5:88:4b","Neighbor"},
  
};

void cb(esppl_frame_info *info) {
  
  String ssid = "";
  if (info->ssid_length > 0) {   
    for (int i= 0; i< info->ssid_length; i++) { ssid+= (char) info->ssid[i]; }
  }

  String source = ""; char srcOctet[2];
  for (int i= 0; i< 6; i++) { sprintf(srcOctet, "%02x", info->sourceaddr[i]); source+=srcOctet; }
  String dest = ""; char destOctet[2];
  for (int i= 0; i< 6; i++) { sprintf(destOctet, "%02x", info->receiveraddr[i]); dest+=destOctet; }
  
  if (info->ssid_length > 0 && !isFound(source, networks)){ // network
    networks[netCount][0]= source;
    networks[netCount][1]= ssid;
    networks[netCount][2]= info->channel;
    networks[netCount][3]= info->rssi;
    netCount++;
  } 
  else if (info->ssid_length <= 0 && !((int) info->frametype == 0 && (int) info->framesubtype == 5) && !isFound(source, clients)) { // client
    clients[clientCount][0]= source;
    clients[clientCount][1]= info->channel;
    clients[clientCount][2]= info->rssi;
    clients[clientCount][3]= dest;
    clientCount++;
  }
}

boolean isFound(String bssid, String arr[][4]) {
  for (int i=0; i<20; i++){
    if (arr[i][0]==bssid) return true;
  }
  return false;
}

void setup() {
  delay(500);
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println(WiFi.status());
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.status());
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  HTTPClient http;
  
  http.begin(serverName);

  http.addHeader("Content-Type", "application/json");
  String msg = "[";
  for (int i=0; i<knownCount; i++) {
    msg+="{\"bssid\":\""+known[i][0]+"\",\"name\":\""+known[i][1]+"\"}";
    if (i!= knownCount-1) msg+= ",";
  }
  msg+="]";
  int httpResponseCode = http.POST(msg);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
 
  http.end();


  esppl_init(cb);
}

void loop() {
  esppl_sniffing_start();
  while (true) {
    progTime = millis();

    for (int i = 1; i < 15; i++ ) {
      esppl_set_channel(i);
      while (esppl_process_frames()) {
        //
      }
    }
    

  
  unsigned long currTime = millis();

  if (currTime - prevTime >= interval) { // every <interval> seconds
    prevTime = currTime;
    Serial.println("Networks: "+(String)netCount);
    
    Serial.println("Clients: "+(String)clientCount);
    esppl_sniffing_stop();
    wifi_promiscuous_enable(false);
    WiFi.mode(WIFI_OFF);
    Serial.println(WiFi.status());
    WiFi.reconnect() ;
    WiFi.mode(WIFI_STA);
//    WiFi.setOutputPower(0);

    WiFi.begin(ssid, password);
    Serial.println("Connecting again");
    while(WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(WiFi.status());
    }
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      http.begin(client,serverName);
    
      http.addHeader("Content-Type", "application/json");
      String msg = "{\"networks\":[";
      for (int i=0; i<netCount; i++) {

        
        msg+= "{\"BSSID\": \""+formatBSSID(networks[i][0])+"\" , \"ESSID\": \""+networks[i][1]+"\", \"Channel\":\""+networks[i][2]+"\", \"RSSI\":\""+networks[i][3]+"\"}";
        Serial.println(msg);
        if (i!= netCount-1) msg+= ",";
      }
      msg+="]}";
      int httpResponseCode = http.POST(msg);
    
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
     
      http.end();

 
      http.begin(client,serverName);
    
      http.addHeader("Content-Type", "application/json");
      msg = "{\"clients\":[";
      for (int i=0; i<netCount; i++) {

        
        msg+= "{\"BSSID\": \""+formatBSSID(clients[i][0])+"\" , \"Channel\": \""+clients[i][1]+"\", \"RSSI\":\""+clients[i][2]+"\", \"Destination\":\""+clients[i][3]+"\"}";
        Serial.println(msg);
        if (i!= netCount-1) msg+= ",";
      }
      msg+="]}";
      httpResponseCode = http.POST(msg);
    
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
     
      http.end();
    }
    else {
      Serial.println("here");
    }
    
    Serial.println();
    memset(networks, 0, sizeof(networks));
    memset(clients, 0, sizeof(clients));
    netCount=0; clientCount = 0;    
    esppl_sniffing_start();
    wifi_promiscuous_enable(true);
  }
    delay(0); // prevent wdt reset
  }  
}

String formatBSSID(String raw) {
  String bssid = (raw.substring(0,2)+":"+raw.substring(2,4)+":"+raw.substring(4,6)+":"+raw.substring(6,8)+":"+raw.substring(8,10)+":"+raw.substring(10,12));
  bssid.toUpperCase();
  return bssid;
}
