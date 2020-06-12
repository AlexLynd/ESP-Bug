function sendJSON(){ 
               
            let result = document.querySelector('#clients'); 
            $.getJSON("clients.json", function(json) {
                console.log(json); // this will show the info it in firebug console
                console.log("enis");
            });





            // result.innerHTML ="<p>fuck</p>";



} 






    //   <tbody>
    //     <tr>
    //       <th scope="row">Jacob</th>
    //       <td>Otto</td>
    //       <td>@mdo</td>
    //       <td>Otto</td>
    //     </tr>
    //     <tr>
    //       <th scope="row">2</th>
    //       <td>Thornton</td>
    //       <td>@fat</td>
    //       <td>Otto</td>
    //     </tr>
    //     <tr>
    //       <th scope="row">3</th>
    //       <td>the Bird</td>
    //       <td>@twitter</td>
    //       <td>Otto</td>
    //     </tr>
    //   </tbody>
