hypem = require './index'

hypem.getUrl '0000', (error, url) ->
    console.log url, error
