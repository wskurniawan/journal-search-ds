const axios = require('axios').default;
const _ = require('lodash');

const config = require('./../config');

module.exports.getData = function(query){
   return new Promise((resolve, reject) => {
      axios.get('https://api.elsevier.com/content/search/scopus?query=' + query + '&apiKey=' + config.api_key).then((result) => {
         var resultEntry = result.data['search-results']['entry'];

         //generalisasi data
         var arrayPromise = resultEntry.map(element => {
            var newElement = {
               title: element['dc:title'],
               creator: element['dc:creator'],
               publicationName: element['prism:publicationName'],
               date: element['prism:coverDisplayDate'],
               category: element['prism:aggregationType'],
               source: 'Scopus',
               url: element.link[2]['@href']
            }

            return Promise.resolve(newElement);
         });
         

         resolve(Promise.all(arrayPromise));
      }).catch(error => {
         reject(error);
      });
   });
};

module.exports.getScienceDirect = function(query){
   return new Promise((resolve, reject) => {
      axios.get('https://api.elsevier.com/content/search/sciencedirect?query=' + query + '&apiKey=' + config.api_key).then(result => {
         var resultEntry = result.data['search-results']['entry'];

         //generalisasi data
         var arrayPromise = resultEntry.map(element => {
            var newElement = {
               url: element.link[1]['@href'],
               title: element['dc:title'],
               creator: element['dc:creator'],
               publicationName: element['prism:publicationName'],
               date: element['prism:coverDate'],
               category: element['prism:doi'],
               source: 'Science Direct'
            }

            return Promise.resolve(newElement);
         });
         

         resolve(Promise.all(arrayPromise));
         //resolve(resultEntry);
      }).catch(error => {
         reject(error);
      });
   });
}