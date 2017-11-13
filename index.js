var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError &&
        error.status >= 400 && error.status < 500 &&
        error.message.indexOf('JSON')) {

        sendJsonParseError(res)

    } else {
        next()
    }
})

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//TODO
//Move it to a controller

const concatAddress = (address) =>
{
    let output = ``
    output += address.buildingNumber ? `${address.buildingNumber} ` : ``
    output += address.street ? `${address.street} ` : ``
    output += address.suburb ? `${address.suburb} ` : ``
    output += address.state ? `${address.state} ` : ``
    output += address.postcode ? `${address.postcode} ` : ``
    return output.trim()

}

const sendJsonParseError = (res) => {
    res.status(400).send({
        "error": "Could not decode request: JSON parsing failed"
    })
}






app.post('/processdata', function(request, response){

    let parsedData = {}
    if(request.body.payload instanceof  Array) {
        let filteredPayload = request.body.payload.reduce(function (filteredItems, item) {
            if (item.workflow === 'completed' && item.type === 'htv') {
                filteredItems.push({
                    concataddress: concatAddress(item.address),
                    type: item.type,
                    workflow: item.workflow
                })
            }
            return filteredItems
        }, [])

        parsedData.response = filteredPayload
    } else {
       return sendJsonParseError(response)
    }

    response.send(parsedData)


});


app.get('/', function(request, response) {
  response.render('pages/index');
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
