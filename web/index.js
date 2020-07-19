function updateTables() {
    let clientTable = document.querySelector('#clients'); var clientString = "";
    let networkTable = document.querySelector('#networks'); var networkString = "";
    let knownTable = document.querySelector('#known'); var knownString = "";

    $.getJSON("clients.json?rand=" + Date.now(), function (rawData) {  // update clients
        $.each(rawData, function (header, clients) {
            $.each(clients, function (header, client) {
                clientString += "<tr>";
                cvals = Object.values(client);
                clientString += "<td>"+cvals[0]+"</td>";
                clientString += "<td>"+getManufacturer(cvals[0])+"</td>";
                clientString += "<td>"+cvals[1]+"</td>";
                clientString += "<td>"+cvals[2]+"</td>";
                clientString += "<td>"+cvals[3]+"</td>";
                if (isKnown(cvals[0])) {
                    knownString += "<tr>";
                    knownString += "<td>" + getName(cvals[0]) + "</td>"
                    knownString += "<td>" + cvals[0] + "</td>"
                    knownString += "<td>" + getManufacturer(cvals[0]) + "</td>";
                    knownString += "<td>" + cvals[2] + "</td>"
                    knownString += "</tr>"
                }
                clientString += "</tr>";
                
            });
        });
        clientTable.innerHTML = clientString;
        knownTable.innerHTML = knownString;

    });

    $.getJSON("networks.json?rand=" + Date.now(), function (rawData) {  // update networks
        $.each(rawData, function (header, clients) {
            $.each(clients, function (header, client) {
                networkString += "<tr>";
                vals = Object.values(client);
                networkString += "<td>"+vals[0]+"</td>";
                networkString += "<td>"+getManufacturer(vals[0])+"</td>";
                networkString += "<td>"+vals[1]+"</td>";
                networkString += "<td>"+vals[2]+"</td>";
                networkString += "<td>"+vals[3]+"</td>";
                if (isKnown(vals[0])) {
                    knownString += "<tr>";
                    knownString += "<td>" + getName(vals[0]) + "</td>"
                    knownString += "<td>" + vals[0] + "</td>"
                    knownString += "<td>" + getManufacturer(vals[0]) + "</td>";
                    knownString += "<td>" + vals[3] + "</td>"
                    knownString += "</tr>"
                }

                networkString += "</tr>";
                
            });
        });
        networkTable.innerHTML = networkString;
    });
}


function isKnown(bssid) {  // detect found BSSID
    var found = false;
    $.ajax({
        type: "GET",
        url: "known.csv?rand=" + Date.now(),
        async: false,
        success: function (data) {
            var lines = data.split(/\r\n|\n/);
            for (var i = 1; i < lines.length - 1; i++) { // ignore header and blank line
                var data = lines[i].split(',');
                if (data[0] == bssid) { found = true; }
            }
        }
    });
    return found;
}

function getManufacturer(bssid) {
    vendor = "unknown";
    $.ajax({
        type: "GET",
        url: "mac-vendors.txt",
        async: false,
        success: function (data) {
            var lines = data.split(/\r\n|\n/);
            for (var i = 1; i < lines.length - 1; i++) { // ignore header and blank line
                var data = lines[i].split('\t');
                if (data[0] == bssid.substring(0,8)) { vendor = data[1]; console.log(vendor); }
            }
        }
    });
    return vendor;
}

function getName(bssid) {
    name = "";
    $.ajax({
        type: "GET",
        url: "known.csv?=" + Date.now(),
        async: false,
        success: function (data) {
            var lines = data.split(/\r\n|\n/);
            for (var i = 1; i < lines.length - 1; i++) { // ignore header and blank line
                var data = lines[i].split(',');
                if (data[0] == bssid) { name = data[1]; }
            }
        }
    });
    return name;
}

function updateContent() {
    updateTables();
    window.setInterval(updateTables, 5000);
}