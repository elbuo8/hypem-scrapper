## Hypem Scrapper ##

This is a simple module used to obtain the URL of a specific song be providing its **mediaid**.

```js
var hypem;

hypem = require('hypem-scrapper');

//Async
hypem.getUrl('1wdx7', function(error, url) {
  return console.log(url);
});

//Non-Async
hypem.getUrlSync('1wdx7', function(error, url) {
  return console.log(url);
});

```

## License ##

MIT

## Credits ##

[Farid Zakaria](http://blog.fzakaria.com/2012/10/hypem-api-changes/)
