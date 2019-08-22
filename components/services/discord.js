const { Client, Attachment } = require('discord.js');
const fs = require('fs');
const {cleanURL, isYoutube} = require("../lib");
const lame = require('lame');
const ytdl = require('ytdl-core');
//const SoundCloud = require('soundcloud-api-client');
import Service from '../service';
import commandController from '../commandController';
const request = require("request");

class Discord extends Service {
  constructor(hostConfig) {
    //console.log(cleanURL, isYoutube);
    super(hostConfig);
    //console.log("Loading Discord with config", hostConfig);
    this.stream = null;
    //this.volume = 0.05;
    //this.decode = null;

    this.sessions = {};

    const client = new Client();
    this.client = client;
    this.voicechannel = hostConfig.voicechannel;

    this.lastInput = null;

    this.channel;
    this.voiceConnection;

    this.DCTimer;

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

    //this.soundcloud = new SoundCloud('394087696');

    client.login(hostConfig.token);
  }

  quit(reason) {
    console.log("Discord stopped...");
    this.leaveAudiochannel();
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
      "from": {
        "username": user.username,
        "id": user.id
      },
      "to": data.channel
    };
    this.lastInput = input;
    for(var command in commandController.commands) {
      try {
        commandController.commands[command].evaluateMessage(input, this)
      }
      catch(err) {
        console.error(err);
      }
    }
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
    //console.log("Goto join a voicechannel!");
    //let channel = this.client.channels.find("name", this.voicechannel);
    //let channel = this.client.channels.get(this.voicechannel);
    //let channel = this.joinAudiochannel();
    //console.log(channel);
    this.stopDCTimer();

    let play = function(url) {
      let connection = this.voiceConnection;
      let dispatcher;
      if(isYoutube(url)) {
        // Youtube Vid
        console.log("Youtube");
        const stream = ytdl(url, { filter : 'audioonly' });
        //console.log("YT Stream",stream);
        dispatcher = connection.playStream(stream);
        stream.on('error', function(error) {
          console.log("YTDL error!",error);
          //this.leaveAudiochannel();
          this.writeLine(this.lastInput.to, "Youtube error, check log");
        }.bind(this));
      }
      else
      {
        if(fs.existsSync(url)) {
          var readStream = fs.createReadStream(url);
          //console.log(this.voicechannel);
          dispatcher = connection.playStream(readStream);
        }
        else
        {
          console.log("Not on filesystem, try Request");
          dispatcher = connection.playStream(request(url));
        }
      }

      dispatcher.on('end', function() {
        console.log("Dispatcher end");
        this.startDCTimer();
      }.bind(this));
    }.bind(this)

    if(this.voiceConnection) {
      //console.log("Channel: exists",this.channel);
      //console.log(this.voiceConnection);
      play(url);
    }
    else {
      this.joinAudiochannel(play.bind(this, url));
    }
  }

  joinAudiochannel(then) {
    this.channel = this.findAudioChannelToJoin();
    this.channel.join().then(connection => {
      //console.log("Connection: ", connection);
      this.voiceConnection = connection;
      console.log("Joined Audiochannel!");
      if(then) {
        then();
      }
    });
  }

  findAudioChannelToJoin() {
    let channel = null;
    //console.log("Before");
    this.client.channels.forEach(function(value, key, map) {
      //console.log(typeof value);
      //console.log(key, Object.getPrototypeOf(value));
      /*if(value.has("members")) {
        console.log(key, value);
      }*/
      if(value.constructor.name == "VoiceChannel") {
        if(value.members.has(this.lastInput.from.id)) {
          console.log("Has member");
          //console.log(value.members.get(this.lastInput.from.id).user.username);
          channel = value;
          //break;
        }
        /*value.members.forEach(function(value,key,map) {
          //console.log(value.user);
          //console.log(value.user.username);
          if(value.user.username == username) {
            // This channel have the user we are looking for, join this on
            console.log(channel);
          }
        });*/
      }
    }.bind(this))
    //console.log("After", channel);
    if(!channel) {
      channel = this.client.channels.get(this.voicechannel);
    }
    console.log("Channel: ",channel);
    return channel;
  }
  leaveAudiochannel() {
    if(this.channel) {
      console.log("Leaving channel");
      this.channel.leave();
    }
    this.channel = null;
    this.voiceConnection = null;
    console.log("Audioconnection reset");
  }

  startDCTimer() {
    console.log("Starting disconnect timer with ", this.hostConfig.dctimeout, "ms wait time");
    this.DCTimer = setTimeout(this.leaveAudiochannel.bind(this), this.hostConfig.dctimeout);
  }
  stopDCTimer() {
    console.log("Clearing DCTimer");
    clearTimeout(this.DCTimer);
  }

}

export default Discord;
