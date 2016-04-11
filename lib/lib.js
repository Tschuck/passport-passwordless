//split a url into the following parts
//  [0]  https://localhost:3000/relative/path/index.html
//  [1]  https
//  [2]  localhost
//  [3]  3000
//  [4]  relative/path/index.html
var splitUrl = function(url) {
  var hostPattern = /(?:([fh]t?tps?):\/\/)?(?:www.)?([^:\/]*)(?::([0-9]+))?(?:\/(.*))?/; 
  var splicedHost = hostPattern.exec (url);

  return splicedHost;
};

//build a base url from a full url
//  https://localhost:3000/relative/path/index.html => https://localhost:3000
var getBaseUrl = function(url) {
  var splicedHost = splitUrl(url);

  if (splicedHost.length > 3) {
    return splicedHost[1] + '://' + splicedHost[2] + (splicedHost[3] ? ':' + splicedHost[3] : '');
  } else {
    return url;
  }
};

module.exports = {
  splitUrl   : splitUrl,
  getBaseUrl : getBaseUrl
};