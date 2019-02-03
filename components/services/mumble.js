const lame = require('lame');
const mumble = require( 'mumble' );
const fs = require('fs');
const streamy = require("youtube-audio-stream");
const lib = require("../lib");
import Service from '../service';

class Mumble extends Service {
  constructor(hostConfig, commandController) {
    super(hostConfig, commandController);
    console.log("Loading Mumble with config", hostConfig);
    this.stream = null;
    this.volume = 0.05;
    //this.decode = null;

    this.sessions = {};

    mumble.connect( hostConfig.mumble_url, function( error, client ) {
        if( error ) { throw new Error( error ); }

        //client.authenticate('mp3-' + unique);
        this.client = client;
        client.authenticate(hostConfig.name,null,[hostConfig.token]);
        client.on( 'initialized', function() {
        }.bind(this));


        // Show all incoming events and the name of the event which is fired.
        client.on( 'protocol-in', this.onDefault.bind(this));
        client.on( 'ready', this.onReady.bind(this));
        client.on( 'textMessage', this.onMessage.bind(this));

        // Collect user information
        client.on( 'userState', function (state) {
          this.sessions[state.session] = state;
        }.bind(this));


    }.bind(this));
  }

  writeLine(to, text) {
    //console.log(text);
    this.client.user.channel.sendMessage(text);
  }

  stopSound() {
    if(this.stream != null) {
      this.stream.end();
      this.stream.unpipe();
      this.playing = false;
    }
  }

  playSound(url, onEnd) {
    //url = lib.cleanURL(url);
    console.log("Mumble URL", url);
    //var stream;
    var decoder = new lame.Decoder();
    if(this.stream != null) {
      this.stream.end();
      this.stream.unpipe();
      //this.stream.close();
    }

    decoder.on('format', function( format ) {
        //console.log( format );
        this.playing = true;
        this.stream.pipe(this.client.inputStream({
              channels: format.channels,
              sampleRate: format.sampleRate,
              gain: this.volume
          })
        );
    }.bind(this));
    try {
      this.stream = streamy(url).pipe(decoder);
      //console.log(this.stream);
      this.stream.on('format', function(format) {
        console.log("FORMAT", format);
      })
      this.stream.on('close', function(g) {
        console.log("Close ",g);
      })
      this.stream.on('finish', function(finish) {
        console.log("Finish ",finish);
        if(onEnd != null) {
          onEnd();
        }
      })
      this.stream.on('prefinish', function(prefinish) {
        console.log("Prefinish ",prefinish);
      })
      this.stream.on('end', function(end) {
        console.log("End ",end);
      })
      this.stream.on('error', function(error) {
        console.log("Error ",error);
      })
      //this.stream.on
      //console.log(decoder._events);
      console.log(this.stream._events);
    }
    catch(err) {
      console.error(err);
    }


    //stream(url).pipe(new lame.Decoder).pipe(this.client.inputStream());
  }

  incrementVolume(addVolume) {
    var newVolume = this.volume+addVolume;
    if(newVolume > 1) {
      newVolume = 1;
    }
    this.volume = newVolume;
  }
  decreaseVolume(decreaseVolume) {
    var newVolume = this.volume-decreaseVolume;
    if(newVolume < 0) {
      newVolume = 0;
    }
    this.volume = newVolume;
  }

  onMessage(data) {
    var user = this.sessions[data.actor];
    console.log(user.name + ':', data.message);
    var input = {
      "message": data.message,
      "from": user.name,
      "to": null
    };
    for(var command in this.cc.commands) {
      try {
        this.cc.commands[command].evaluate(input, this)
      }
      catch(err) {
        console.error(err);
      }
    }
    /*this.cc.commands[command].evaluate(data.message).done(function(answers){
      for(var answer in answers) {
        if(answers[answer].audio != null) {
          this.play.bind(this, client, answers[answer].audio)();
        }
        client.user.channel.sendMessage(answers[answer].text);
      }
    }, function(reject) {console.log("Rejected")});*/
  }
  onReady(data) {
      console.log("Users:");
      var list = this.client.users();
      for(var key in list) {
          var user = list[key];
          console.log("  - " + user.name + " in channel " + user.channel.name);
      }
      console.log("\nThose were all users!");
  }
  onDefault(data) {
    //console.log('event', data.handler, 'data', data.message);
  }
}

export default Mumble;
