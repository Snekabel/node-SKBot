const url = require('url');

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
exports.tryFilter = function(filter, data, then) {
  //console.log(filter);
  let filterParts = filter.split(/\s+/);
  let dp = data.split(/\s+/);
  var result = [];
  if(dp.length != filterParts.length) {
    return;
  }
  for(let part in filterParts) {
    //console.log(part, filterParts[part], dp[0].indexOf("!"));
    if(part == 0 && filterParts[part].indexOf("cI") > -1 && dp.length > 0 && dp[0].indexOf("!") < 0) {
      //console.log("FAIL");
      return;
    }
    else if(part == 0 && filterParts[part].indexOf("cI") > -1 && dp.length > 0 && dp[0].indexOf("!") > -1) {
      //console.log("First stage done");
      filterParts[part] = filterParts[part].substring(2);
      dp[part] = dp[part].substring(1);
    }
    //console.log(part, dp[part]);

    if(!dp[part] || filterParts[part][0].indexOf("$") < 0 && dp[part] != filterParts[part]) {
      //console.log("ALSO FAIL!");
      return;
    }
    else if(dp[part] && filterParts[part][0].indexOf("$") < 0 && dp[part] == filterParts[part]) {
      //console.log("String to Match, continue");
      // String to match
      continue;
    }
    else if(dp[part] && filterParts[part][0].indexOf("$") > -1) {
      //console.log("Variable: ",dp[part]);
        // Variable
        result.push(dp[part]);
      }
  }
  then(result);
}
exports.findLinks = function(message) {
  let links = [];

  let split = message.split(/\s+/);
  //console.log(split);
  for(var i in split) {
    if(split.hasOwnProperty(i)){
      let word = split[i];
      //console.log("Word: ",word);
      if(word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
        word = word.substring((word.indexOf("http://")||word.indexOf("https://")));
        if(word.indexOf("\"") > -1)
        {
          word = word.substring(0, word.indexOf("\""));
        }
        word = exports.cleanURL(word);
        //console.log("Website!",word);

        links.push(
          url.parse(word)
        );
      }
    }
  }
  return links;
}
