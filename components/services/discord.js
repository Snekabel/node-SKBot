const { Client, Attachment } = require('discord.js');
const fs = require('fs');
const lib = require("../lib");
const lame = require('lame');
import Service from '../service';

class Discord extends Service {
  constructor(hostConfig, commandController) {
    super(hostConfig, commandController);
    console.log("Loading Discord with config", hostConfig);
    this.stream = null;
    this.volume = 0.05;
    //this.decode = null;

    this.sessions = {};

    const client = new Client();
    this.client = client;
    this.voicechannel = null;

    /*mumble.connect( hostConfig.mumble_url, function( error, client ) {
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
    }.bind(this));*/
    client.on('ready', () => {
      this.onReady();
    });

    client.on('message', msg => {
      /*if (msg.content === 'ping') {
        msg.reply('pong');
      }*/
      //console.log(msg);
      this.onMessage(msg);
    });

    client.login(hostConfig.token);
  }

  writeLine(to, text) {
    //console.log("WriteLine!",to, text);
    if(typeof to == "string") {
      if(isNaN(to)) {
        //console.log("String");
        let channel = this.client.channels.find("name",to);
        channel.send(text);
      }
      else {
        //console.log("ID");
        this.client.channels.get(to).say(text);
      }
      // Channel Name?
    }
    else if(typeof to == "object") {
      // Channelobject?
      console.log("Object");
      to.send(text);
    }
    //this.client.user.channel.sendMessage(text);

  }

  onMessage(data) {
    var user = data.author;
    if(user.id == this.client.user.id) {
      return;
    }
    //console.log(user);
    console.log(user.username + ':', data.content);
    let dm = false;
    if(data.channel.type == "dm") {
      dm = true;
    }
    //console.log(data.channel.id);
    var input = {
      "message": data.content,
      "from": user.username,
      "to": data.channel
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
      //console.log(this.client);
      console.log(`Logged in as ${this.client.user.tag}!`);
      /*console.log("Users:");
      var list = this.client.users();
      for(var key in list) {
          var user = list[key];
          console.log("  - " + user.name + " in channel " + user.channel.name);
      }
      console.log("\nThose were all users!");*/
  }
  onDefault(data) {
    //console.log('event', data.handler, 'data', data.message);
  }

  playSound(url, onEnd) {
    console.log("PLAY SOUND!",url, onEnd);
    var readStream = fs.createReadStream(url);
    console.log(this.voicechannel);
    if(!this.voicechannel) {
      console.log("Goto join a voicechannel!");
      let channel = this.client.channels.find("name", "General");
      console.log(channel);
      if(channel) {
        channel.join().then(connection => {
          //resolve(connection);
          this.audiochannel = connection;
          console.log("Joined Audiochannel!");
          this.audiochannel.playStream(readStream);
        });
        //channel.playStream(readStream);
      }
    }
    else {
      this.audiochannel.playStream(readStream);
    }
    /*
    */
  }
}

export default Discord;
