request = require 'request'
querystring = require 'querystring'
async = require 'async'

###
Credits go to Farid Zakaria (http://blog.fzakaria.com/2012/10/hypem-api-changes/)
###

#Make simple functions.


getUrlSync = (metaid, callback) ->
    params =
        ax : 1,
        ts : new Date().getTime()

    trackUrl = 'http://hypem.com/track/' + metaid + '?' + querystring.stringify params
    request.get trackUrl, (error, response, body) ->
        body = body.split '\n'
        for num in [body.length..0]
            if String(body[num]).indexOf('key') != -1
                key = JSON.parse(body[num].replace '</script>', '').tracks[0].key
                serveUrl = 'http://hypem.com/serve/source/' + metaid + '/' + key + '?_=' + new Date().getTime()
                request.get serveUrl, (error, response, body) ->
                    if response.statusCode == 200 then callback null, JSON.parse(body).url else callback body, null



getUrl = (metaid, callback) ->
    params =
        ax : 1,
        ts : new Date().getTime()

    trackUrl = 'http://hypem.com/track/' + metaid + '?' + querystring.stringify params
    request.get trackUrl, (error, response, body) ->
        body = body.split '\n'
        async.detectSeries body.reverse(), (line, callback) ->
            if line.indexOf('key') != -1 then callback(true) else callback(false)
        , (line) ->
            key = JSON.parse(line.replace '</script>', '').tracks[0].key
            serveUrl = 'http://hypem.com/serve/source/' + metaid + '/' + key + '?_=' + new Date().getTime()
            request.get serveUrl, (error, response, body) ->
                if response.statusCode == 200 then callback null, JSON.parse(body).url else callback body, null


exports.getUrlSync = getUrlSync
exports.getUrl = getUrl
