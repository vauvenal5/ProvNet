require("@babel/register");
var port = process.env.PORT || 3000;
var app = require("./app").app;
app.listen(port, function () {
    console.log('Example app listening on port', port);
});