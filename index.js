var express = require('express');
var bodyParser = require('body-parser');
var filterController = require('./controller/filterController')
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




const sendJsonParseError = (res) => {
    res.status(400).send({
        "error": "Could not decode request: JSON parsing failed"
    })
}






app.post('/processdata', filterController.processData);


app.get('/', function(request, response) {
  response.render('pages/index');
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
