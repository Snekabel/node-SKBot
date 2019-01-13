import Command from '../command';
//import settings from


class Music extends Command {

  constructor() {
    super();

    this.helpDescription = "Music component";
    this.shortDescription= "Template Short Help";

    this.playlist = [];
    this.currentSong = -1;
    this.repeat = false;
    this.cI = null;
  }

  evaluate(input, service) {
    //console.log("service",service);
    var services = super.getServices(service);

    var message = input.message;
    var split = message.split(/\s+/);

    //console.log(this.playlist);

    if(split[0].indexOf("!add") > -1){
      for(var i in split) {
        var url = this.cleanURL(split[i]);
        console.log("Try: ",url);
        if(url.indexOf("http") > -1) {
          //console.log("lol ",url);
          this.addMusic(url);
          service.writeLine(input.from, url+" added to playlist");
        }
      }
    }
    else if(split[0].indexOf("!play") > -1) {
      if(this.playlist.length > 0) {
        this.playNext(service);
      }
    }
    else if(split[0].indexOf("!stop") > -1) {
      service.stopSound();
    }
    else if(split[0].indexOf("!next") > -1 || split[0].indexOf("!skip") > -1) {
      this.playNext(service);
    }
    else if(split[0].indexOf("!list") > -1) {
      service.writeLine(input.from, this.playlist.toString());
    }
    else if(split[0].indexOf("!clean") > -1) {
      this.playlist = [];
      service.writeLine(input.from, "Playlist Clean");
    }
    else if(split[0].indexOf("!repeat") > -1) {
      this.repeat = !this.repeat;
      service.writeLine(input.from, "Repeat: "+this.repeat);
    }
    else if(split[0].indexOf("!vol+") > -1) {
      service.incrementVolume(0.2);
      service.writeLine(input.from, "Volume: "+service.volume);
    }
    else if(split[0].indexOf("!vol-") > -1) {
      service.decreaseVolume(0.2);
      service.writeLine(input.from, "Volume: "+service.volume);
    }
  }

  addMusic(song) {
    this.playlist.push(song);
  }

  playNext(service) {
    console.log("PLAY NEXT!");
    console.log("Service Playing",service.playing);
    this.currentSong++;
    if(service.playing) {
      //this.playlist.shift();
console.log("Playing!");
    }
    else { console.log("Not playing");}

    if(this.playlist.length > this.currentSong) {
      service.playSound(this.playlist[this.currentSong], function() {
        this.playNext(service);
      }.bind(this));
    }
    else {
      this.currentSong = -1;
      if(this.repeat) {
        this.playNext(service);
      }
    }
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
