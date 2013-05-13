// Generated by CoffeeScript 1.6.2
(function() {
  var async, getUrl, getUrlSync, querystring, request;

  request = require('request');

  querystring = require('querystring');

  async = require('async');

  /*
  Credits go to Farid Zakaria (http://blog.fzakaria.com/2012/10/hypem-api-changes/)
  */


  getUrlSync = function(metaid, callback) {
    var params, trackUrl;

    params = {
      ax: 1,
      ts: new Date().getTime()
    };
    trackUrl = 'http://hypem.com/track/' + metaid + '?' + querystring.stringify(params);
    return request.get(trackUrl, function(error, response, body) {
      var key, num, serveUrl, _i, _ref, _results;

      body = body.split('\n');
      _results = [];
      for (num = _i = _ref = body.length; _ref <= 0 ? _i <= 0 : _i >= 0; num = _ref <= 0 ? ++_i : --_i) {
        if (String(body[num]).indexOf('key') !== -1) {
          key = JSON.parse(body[num].replace('</script>', '')).tracks[0].key;
          serveUrl = 'http://hypem.com/serve/source/' + metaid + '/' + key + '?_=' + new Date().getTime();
          _results.push(request.get(serveUrl, function(error, response, body) {
            if (response.statusCode === 200) {
              return callback(null, JSON.parse(body).url);
            } else {
              return callback(body, null);
            }
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };

  getUrl = function(metaid, callback) {
    var params, trackUrl;

    params = {
      ax: 1,
      ts: new Date().getTime()
    };
    trackUrl = 'http://hypem.com/track/' + metaid + '?' + querystring.stringify(params);
    return request.get(trackUrl, function(error, response, body) {
      body = body.split('\n');
      return async.detectSeries(body.reverse(), function(line, callback) {
        if (line.indexOf('key') !== -1) {
          return callback(true);
        } else {
          return callback(false);
        }
      }, function(line) {
        var key, serveUrl;

        key = JSON.parse(line.replace('</script>', '')).tracks[0].key;
        serveUrl = 'http://hypem.com/serve/source/' + metaid + '/' + key + '?_=' + new Date().getTime();
        return request.get(serveUrl, function(error, response, body) {
          if (response.statusCode === 200) {
            return callback(null, JSON.parse(body).url);
          } else {
            return callback(body, null);
          }
        });
      });
    });
  };

  exports.getUrlSync = getUrlSync;

  exports.getUrl = getUrl;

}).call(this);
