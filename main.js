const express = require('express');
const body_parser = require('body-parser');

const app = express();

//get data
const get_data = require('./service/get_data');

app.use(body_parser.json());
app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res, next){
   res.render('front');
});

app.get('/search', function(req, res, next){
   if(!req.query.query){
      return res.status(400).send('Keyword tidak boleh kosong');
   }


   var arrayResult = [];
   //get Scopus data
   get_data.getData(req.query.query).then(result => {
      arrayResult = arrayResult.concat(result);

      //get dari sciencedirect
      return get_data.getScienceDirect(req.query.query);
   }).then(result => {
      arrayResult = arrayResult.concat(result);

      console.log(arrayResult[0]);
      res.render('web_service', { list_result: arrayResult, query: req.query.query });
   }).catch(error =>{
      next(error);
   });
});

app.use(function(err, req, res, next){
   console.log(err);
   res.status(500).send('Internal server error');
});

app.listen(process.env.PORT || 5000, function(){
   console.log('app ready');
})