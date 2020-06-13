function updateTables() {         

    let clientTable  = document.querySelector('#clients');  var clientString  = "";
    let networkTable = document.querySelector('#networks'); var networkString = "";
    let knownTable   = document.querySelector('#known');    var knownString   = "";


    $.getJSON("known.json", function(json_data) {  // update known devices

        
    });
 
    $.getJSON("clients.json", function(rawData) {  // update clients
        $.each(rawData, function( header, clients ) {
            $.each(clients, function( header, client ) {
                clientString+= "<tr>";
                $.each(client, function( key, value ) {
                    clientString+= "<td>"+value+"</td>";
                }); 
                clientString+="</tr>";
            }); 
        });
        clientTable.innerHTML=clientString;
    });

    $.getJSON("networks.json", function(rawData) {  // update networks
        $.each(rawData, function( header, clients ) {
            $.each(clients, function( header, client ) {
                networkString+= "<tr>";
                $.each(client, function( key, value ) {
                    networkString+= "<td>"+value+"</td>";
                }); 
                networkString+="</tr>";
            }); 
        });
        networkTable.innerHTML=networkString;
    });
    
    

} 

function updateContent() {
    updateTables();
    window.setInterval(updateTables, 5000);
    
}