var lib = {
  cleanURL: function(dirtyURL) {
    var cleanURL = dirtyURL.substring(dirtyURL.indexOf("http://"));
    if(dirtyURL.indexOf("\"") > -1)
    {
      cleanURL = dirtyURL.substring(0, dirtyURL.indexOf("\""));
    }
    return cleanURL;
  }
}

export default lib;
