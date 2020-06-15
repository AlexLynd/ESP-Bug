function updateTables() {         
    let clientTable  = document.querySelector('#clients');  var clientString  = "";
    let networkTable = document.querySelector('#networks'); var networkString = "";
    let knownTable   = document.querySelector('#known');    var knownString   = "";



    
    $.getJSON("clients.json?rand="+Date.now(), function(rawData) {  // update clients
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

    $.getJSON("networks.json?rand="+Date.now(), function(rawData) {  // update networks
        console.log("here");
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