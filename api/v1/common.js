/*
  Superplayer Project
    (c) 2019 Alexandre Mulatinho
*/

(function () {
  checkStatus = function(inputDate) {
    var dateToInteger = String(inputDate).split('T')[0].replace(/-/g,'')
    var todayIs = new Date().toISOString().split('T')[0].replace(/-/g,'')

    dateToInteger = parseInt(dateToInteger)
    todayIs = parseInt(todayIs)

    if (dateToInteger < todayIs) {
      return 1;
    } else {
      return 0;
    }
  }

  htmlEntities = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g,
    '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  validBodyInput = function(request, data, fields, obligatory = []) {
    var result = true;

    fields.forEach(function(entry) {
      if (request.body[entry] !== undefined && request.body[entry] !== null && request.body[entry] !== '') {
        data[entry] = htmlEntities(request.body[entry]);
      } else {
        obligatory.forEach(function(elem) {
          if (elem == entry) { result = false; return; }
        });
      }
    });

    return result;
  }

  validQueryInput = function(request, data, fields, obligatory = []) {
    var result = true;

    fields.forEach(function(entry) {
      if (request.query[entry] !== undefined && request.query[entry] !== null && request.query[entry] !== '') {
        data[entry] = htmlEntities(request.query[entry]);
      } else {
        obligatory.forEach(function(elem) {
          if (elem == entry) { result = false; }
        });
      }
    });

    return result;
  }

})();
