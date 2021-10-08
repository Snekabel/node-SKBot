import Command from '../classes/command.js';
//const {getYoutube, tryFilter} = require("../lib");
import getYoutube, tryFilter from "../lib";
import serviceController from '../controllers/serviceController.js';
import settingsController from '../controllers/settingsController.js';

class Music extends Command {

  constructor(settings) {
    super(settings);

    this.helpDescription = "Music component. Add songs to playlist and play them in voicechat.";
    this.commands = "!stations";

    this.cI = settingsController.settings.commandInitiator;

    this.playlist = [];
    this.currentSong = -1;
    this.repeat = false;
    this.service = null;
    this.input = null;
  }

  evaluateMessage(input, service) {
    //console.log("service",service);
    this.service = service;
    this.input = input;
    var services = serviceController.getOtherServices(service);

    var message = input.message;
    //var split = message.split(/\s+/);

    //console.log(this.playlist);

    //var inputText = "!stations add bandit http://bandit.mp3";
    //console.log("INPUT: ",message);
    tryFilter("cIPlay", message, function(result) {
      console.log("Play music");
      this.playNext(service);
    }.bind(this));
    tryFilter("cIPlay $url", message, function(result) {
      console.log("Play music");
      service.playSound(result[0],null);
    }.bind(this));
    tryFilter("cINext", message, function(result) {
      console.log("Next Song");
    }.bind(this));
    tryFilter("cIstop", message, function(result) {
      this.stopPlaying();
    }.bind(this))

    return;

    if(split[0].indexOf(this.cI+"add") > -1){
      for(var i in split) {
        var url = this.cleanURL(split[i]);
        console.log("Try: ",url);
        if(url.indexOf("http") > -1) {
          //console.log("lol ",url);
          if(getYoutube(url)) {
            console.log("Youtube Info: ");
          };
          this.addMusic(url);
          service.writeLine(input.to, " added to playlist");
        }
      }
    }
    else if(split[0].indexOf(this.cI+"play") > -1) {
      if(this.playlist.length > 0) {
        this.playNext(service);
      }
    }
    else if(split[0].indexOf(this.cI+"stop") > -1) {
      service.stopSound();
    }
    else if(split[0].indexOf(this.cI+"next") > -1 || split[0].indexOf(this.cI+"skip") > -1) {
      this.playNext(service);
    }
    else if(split[0].indexOf(this.cI+"list") > -1) {
      service.writeLine(input.to, "Songlist: "+this.playlist.toString());
    }
    else if(split[0].indexOf(this.cI+"clean") > -1) {
      this.playlist = [];
      service.writeLine(input.to, "Playlist Clean");
    }
    else if(split[0].indexOf(this.cI+"repeat") > -1) {
      this.repeat = !this.repeat;
      service.writeLine(input.to, "Repeat: "+this.repeat);
    }
    else if(split[0].indexOf(this.cI+"vol+") > -1) {
      service.incrementVolume(0.2);
      service.writeLine(input.to, "Volume: "+service.volume);
    }
    else if(split[0].indexOf(this.cI+"vol-") > -1) {
      service.decreaseVolume(0.2);
      service.writeLine(input.to, "Volume: "+service.volume);
    }
    /*else if(split[0].indexOf("r/a/d.io") > -1) {
       console.log("Play r/a/d.io");
       service.playSound("https://stream.r-a-d.io/main.mp3",null);
    }*/
    else if(split[0].indexOf(this.cI+"stations") > -1) {
      //console.log("Stations! ", this.settings.stations);
      if(split.length > 1) {
        if(split[1] == "add") {
          if(split.length > 2) {
            let name = split[2];
            let url = split[3];
            service.writeLine(input.to, "Adding "+name+" to Stations list");
            this.settings.stations.push({name: name, url: url});
          }
        }
        else {
          let station = split[1];
          for(let i = 0; i < this.settings.stations.length; i++){
            if(this.settings.stations[i].name == station) {
              service.writeLine(input.to, "Playing "+station);
              service.playSound(this.settings.stations[i].url,null);
            }
          }
        }
      }
      else {
        let message = "Stations available: ";
        for(let i = 0; i < this.settings.stations.length; i++){
          let station = this.settings.stations[i];
          message+= station.name+", ";
        }
        service.writeLine(input.to, message);
      }
    }
  }
  stopPlaying() {
    if(this.service.leaveAudiochannel) {
      this.service.leaveAudiochannel();
    }
  }

  listStations() {
    let message = "Stations available: ";
    for(let i = 0; i < this.settings.stations.length; i++){
      let station = this.settings.stations[i];
      message+= station.name+", ";
    }
    this.service.writeLine(this.input.to, message);
  }

  addMusic(song) {
    this.playlist.push(song);
  }

  addSong(message) {
    var split = message.split(/\s+/);
    for(let i in split) {
      var url = this.cleanURL(split[i]);
      console.log("Try: ",url);
      if(url.indexOf("http") > -1) {
        //console.log("lol ",url);
        if(getYoutube(url)) {
          console.log("Youtube Info: ");
        };
        this.addMusic(url);
        service.writeLine(input.to, " added to playlist");
      }
    }
  }

  playNext(service) {
    console.log("PLAY NEXT!");
    console.log("Service Playing",service.playing);
    this.currentSong++;
    if(service.playing) {
      //this.playlist.shift();
      console.log("Playing!");
    }
    else {
      console.log("Not playing");
    }

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
