import Command from '../command';


class Music extends Command {

  constructor() {
    super();

    this.helpDescription = "Music component";
    this.shortDescription= "Template Short Help";

    this.playlist = [];
  }

  evaluate(input, service) {
    //console.log("service",service);
    var services = super.getServices(service);

    var message = input.message;
    var split = message.split(/\s+/);

    if(split[0].indexOf("youtube") > -1){
      for(var i in split) {
        var url = this.cleanURL(split[i]);
        console.log("Try: ",url);
        if(url.indexOf("http") > -1) {
          console.log("lol ",url);
          service.playYoutube(url);
        }
      }
    }
  }

  addMusic(song) {
    this.template.push(song);
  }

  cleanURL(dirtyURL) {
    var cleanURL = dirtyURL.substring(dirtyURL.indexOf("https://"));
    console.log("Clean1: ", cleanURL);
    if(cleanURL.indexOf("\"") > -1)
    {
      cleanURL = cleanURL.substring(0, cleanURL.indexOf("\""));
    }
    console.log("Clean2: ", cleanURL);
    return cleanURL;
  }
}
export default Music;
