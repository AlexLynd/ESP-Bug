// add new device to known.csv
function addDevice() {
    let result = document.querySelector('.result');
    let name = document.querySelector('#name');
    let bssid = document.querySelector('#bssid');

    let xhr = new XMLHttpRequest();
    let url = "submit.php";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            result.innerHTML = this.responseText;
        }
    };
    var data = JSON.stringify([{ "bssid": bssid.value, "name": name.value }]);
    xhr.send(data);
    document.getElementById('name').value = '';
    document.getElementById('bssid').value = '';
    window.setTimeout(loadKnown, 100);
}

// load known.csv to table
function loadKnown() {
    document.getElementById('known').innerHTML = '';
    var rawFile = new XMLHttpRequest();
    var csvFile = "./known.csv?rand=" + Date.now();
    rawFile.open("GET", csvFile, true); // dont cache CSV
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var allTextLines = allText.split(/\r\n|\n/);
                var headers = allTextLines[0].split(',');
                for (var i = 1; i < allTextLines.length - 1; i++) { // ignore header and blank line
                    var knownTable = document.createElement("tr");
                    var data = allTextLines[i].split(',');
                    for (var j = 0; j < 2; j++) {
                        device = document.createElement("td");
                        device.innerHTML = data[j];
                        knownTable.appendChild(device);
                    }
                    var remove = document.createElement("td");
                    var btn = document.createElement("button");
                    btn.innerHTML = "remove";
                    btn.className += "btn btn-danger";
                    btn.setAttribute("onclick", "deleteDevice('" + data[0] + "')");
                    remove.appendChild(btn);
                    knownTable.appendChild(remove);
                    document.getElementById('known').appendChild(knownTable);
                }
            }
        }
    }
    rawFile.send(null);
}

// remove device from known.csv
function deleteDevice(device) {
    let xhr = new XMLHttpRequest();
    let url = "submit.php";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

        }
    };
    var data = JSON.stringify({ "delete": { "bssid": device } }); // idk how to do API stuff
    xhr.send(data);
    window.setTimeout(loadKnown, 100);
} 