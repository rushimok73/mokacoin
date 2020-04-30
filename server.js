const express = require('express');
const app = express();
var TruffleContract = require('truffle');
const PORT = process.env.PORT || 8000;


app.use(express.static('public'));
app.use(express.static('build'));

//EJS
app.set('view engine', 'ejs');


app.use('/', function (req, res, next){
  res.render('index');
});


app.listen(PORT, console.log(`Server started on port ${PORT}`));
