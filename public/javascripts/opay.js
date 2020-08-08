function testopay()
{
    opay_url = "/api/opay?cid=5";
    getAPI(opay_url, function(xhttp){
        console.log(xhttp.responseText);
    });
}