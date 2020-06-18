function updateTables() {         
    let clientTable  = document.querySelector('#clients');  var clientString  = "";
    let networkTable = document.querySelector('#networks'); var networkString = "";
    let knownTable   = document.querySelector('#known');    var knownString   = "";
    
    $.getJSON("clients.json?rand="+Date.now(), function(rawData) {  // update clients
        $.each(rawData, function( header, clients ) {
            $.each(clients, function( header, client ) {
                clientString+= "<tr>"; knownString+="<tr>";
                $.each(client, function( key, value ) {
                    clientString+= "<td>"+value+"</td>";
                    isKnown(value);
                    if (key=="BSSID" && isKnown(value)) {
                        
                        knownString+="<td>"+value+"</td>"
                    }
                }); 
                clientString+="</tr>";
            }); 
        });
        clientTable.innerHTML=clientString;
        knownTable.innerHTML=knownString;
    });

    $.getJSON("networks.json?rand="+Date.now(), function(rawData) {  // update networks
        $.each(rawData, function( header, clients ) {
            $.each(clients, function( header, client ) {
                networkString+= "<tr>";
                $.each(client, function( key, value ) {
                    networkString+= "<td>"+value+"</td>";
                    // isKnown(value);
                }); 
                networkString+="</tr>";
            }); 
        });
        networkTable.innerHTML=networkString;
    });    

} 

function isKnown(bssid) {  // detect found BSSID
    var found = false;
    $.ajax({
        type: "GET",
        url: "known.csv?rand="+Date.now(),
        async: false,
        success: function(data) {
            var lines = data.split(/\r\n|\n/);
            for (var i=1; i<lines.length-1; i++) { // ignore header and blank line
                var data = lines[i].split(',');
                if (data[0]==bssid) {found = true;}                    
            }
        }
    });
    return found;
}

getManufacturer("00:00:00");
function getManufacturer(bssid) {
    vendor="";
    $.ajax({
        type: "GET",
        url: "mac-vendors.txt",
        async: false,
        success: function(data) {
            var lines = data.split(/\r\n|\n/);
            for (var i=1; i<lines.length-1; i++) { // ignore header and blank line
                var data = lines[i].split('\t');
                
                if (data[0]==bssid) { console.log(data); vendor = data[1];}                    
            }
        }
    });
    return vendor;
}

function updateContent() {
    updateTables();
    window.setInterval(updateTables, 5000);
}