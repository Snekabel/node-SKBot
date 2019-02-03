
exports.cleanURL = function(dirtyURL) {
  var cleanURL = dirtyURL.substring(dirtyURL.indexOf("http://"));
  if(dirtyURL.indexOf("\"") > -1)
  {
    cleanURL = dirtyURL.substring(0, dirtyURL.indexOf("\""));
  }
  return cleanURL;
}
exports.getYoutube = function(youtubeUrl) {
  if(exports.isYoutube(youtubeUrl)) {
    console.log("Is youtube");
  }
  else {
    console.log("IS not");
  }
}
exports.isYoutube = function(url) {
  let regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g;
  return url.match(regex);
}
