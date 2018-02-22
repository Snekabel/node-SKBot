var lame = require('lame');
var mumble = require( 'mumble' );
var fs = require('fs');

class Mumble {
  constructor(hostConfig, commandController) {
    console.log("Loading Mumble with config", hostConfig);
    this.cc = commandController;
    this.stream = null;
    this.decode = null;

    mumble.connect( hostConfig.mumble_url, function( error, client ) {
        if( error ) { throw new Error( error ); }

        //client.authenticate('mp3-' + unique);
        this.client = client;
        client.authenticate(hostConfig.name,null,[hostConfig.token]);
        client.on( 'initialized', function() {
          //console.log(this.start);
          //this.start( client );
          //this.play(client, "102-palette_town_theme.mp3");
        }.bind(this));
        client.on('ready', function() {
        console.log("Ready!");
        console.log("Users:");
        var list = client.users();
        for(var key in list) {
            var user = list[key];
            console.log("  - " + user.name + " in channel " + user.channel.name);
        }
        console.log("\nThose were all users!");
        });

        // Show all incoming events and the name of the event which is fired.
        client.on( 'protocol-in', function (data) {
          //console.log('event', data.handler, 'data', data.message);
        });

        // Collect user information
        var sessions = {};
        client.on( 'userState', function (state) {
          sessions[state.session] = state;
        });

        client.on( 'textMessage', function (data) {
          var user = sessions[data.actor];
          console.log(user.name + ':', data.message);
          var input = {
            "message": data.message,
            "from": user.name,
            "to": null
          };
          for(var command in this.cc.commands) {
            this.cc.commands[command].evaluate(input, this);
          }
          /*this.cc.commands[command].evaluate(data.message).done(function(answers){
            for(var answer in answers) {
              if(answers[answer].audio != null) {
                this.play.bind(this, client, answers[answer].audio)();
              }
              client.user.channel.sendMessage(answers[answer].text);
            }
          }, function(reject) {console.log("Rejected")});*/
        }.bind(this));
    }.bind(this));
    //console.log(this.start);
  }

  writeLine(to, text) {
    //console.log(text);
    this.client.user.channel.sendMessage(text);
  }

  playSound(audio_file, callback) {
    var client = this.client;
    var stream = this.stream;
    if(stream != null) {
      stream.end();
    }
    //console.log(this);

    var input = client.inputStream();
    if(input != null) {
      //console.log(input);
      input.close();
    }

    if(this.decoder != null) {
      //this.decoder.getEmitter().emit("finish");
      this.decoder = null;
    }
    this.decoder = new lame.Decoder();
    //var stream;


    this.decoder.on('format', function( format ) {
        //console.log( format );
        stream.pipe( client.inputStream({
              channels: format.channels,
              sampleRate: format.sampleRate,
              gain: 0.005
          })
        );
    }.bind(this));

    this.decoder.on('close', callback);

    //stream = process.stdin.pipe( decoder );
    stream = fs.createReadStream(audio_file).pipe(this.decoder);
  }
}

export default Mumble;
