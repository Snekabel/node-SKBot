//const { Client, Attachment, RichEmbed } = require('discord.js');
import discord from "discord.js";
const Client = discord.Client;
const Attachment = discord.Attachment;
const RichEmbed = discord.RichEmbed;
//const fs = require('fs');
import fs from "fs";
//const ytdl = require('ytdl-core');
import ytdl from "ytdl-core";
//const request = require("request");
import request from "request";
//const SoundCloud = require('soundcloud-api-client');
//const {cleanURL, isYoutube} = require("../lib");
import {cleanURL, isYoutube} from "../lib.js";
import Service from '../classes/service.js';
import Input from '../classes/input.js';
import commandController from '../controllers/commandController.js';


class Discord extends Service {
  constructor(hostConfig) {
    //console.log(cleanURL, isYoutube);
    super(hostConfig);
    this.name = "Discord";
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

      let user = this.client.user;
      user.setStatus('idle');
      //user.setAvatar("https://productimages.biltema.com/v1/Image/article/medium/411003/1");
      user.setActivity("you sleep", {type: 'WATCHING'})
    });

    client.on('message', msg => {
      /*if (msg.content === 'ping') {
        msg.reply('pong');
      }*/
      //console.log(msg);
      //this.onMessage(msg);

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
      let inputObject = new Input(input);

      this.onMessage(inputObject);
    });

    //this.soundcloud = new SoundCloud('394087696');

    client.login(hostConfig.token);
  }

  quit(reason) {
    console.log("Discord stopped...");
    this.leaveAudiochannel();
  }

  evaluateAnswer(answer) {
    console.log("Answer: ",answer);
    //console.log(this.name, answer.to.service);
    if(answer.to.service && answer.to.service.name !== this.name) {
      // Send this to this other service
      //console.log("Send this to another service");
      answer.to.service.evaluateAnswer(answer);
    }
    else {
      if(answer.text) {
        this.writeLine(answer.to.recipient, answer.text);
      }
      if(answer.audio) {
        this.playSound(answer.audio);
      }
      if(answer.image) {
        this.sendImage(answer.to.recipient, answer.image);
      }
      if(answer.fancy) {
        this.sendFancy(answer.to.recipient, answer.fancy.title, answer.fancy.description);
      }
    }
  }

  getTo(to) {
    // Returns the channelobject ya can send stuff to;
    if(typeof to == "string") {
      if(isNaN(to)) {
        //console.log("String");
        let channel = this.client.channels.find("name",to);
        //channel.send(text);
        return channel;
      }
      else {
        //console.log("ID");
        //this.client.channels.get(to).say(text);
        return this.client.channels.get(to);
      }
      // Channel Name?
    }
    else if(typeof to == "object") {
      // Channelobject?
      //to.send(text);
      return to;
    }
  }

  writeLine(to, text) {
    //console.log("WriteLine!",to, text);
    let channel = this.getTo(to);
    channel.send(text);
    //this.client.user.channel.sendMessage(text);
  }

  sendImage(to, image) {
    let channel = this.getTo(to);
    console.log("Image: ",image);
    if(fs.existsSync("./images/"+image)) {
      console.log("We have the image in ./images/");
      //var readStream = fs.createReadStream("./images/"+image);
      //console.log(this.voicechannel);
      //const embed = new RichEmbed()
      // Set the title of the field
      //.setTitle('A slick little embed')
      // Set the color of the embed
      //.setColor(0xff0000)
      // Set the main content of the embed
      //.setDescription('Hello, this is a slick embed!')
      //.attachFiles(["./images/"+image]);
      // Send the embed to the same channel as the message
      //console.log(embed);
      //channel.send(embed);
      //message.channel.send(embed);
      //let message = new Message(channel);
      //const attachment = new MessageAttachment(message, "./images/"+image);
      //channel.send(attachment);
      //channel.sendEmbed("./images/"+image)
      channel.send({
        files: ["./images/"+image]
      })
    }
    else
    {
      console.log("Not on filesystem, try as URL");
      //const embed = new RichEmbed()
      // .attachFiles([image]);
      //channel.send(embed);
      //const attachment = new MessageAttachment(image);
      //channel.send(attachment);
      channel.send({
        files: [image]
      })
    }
  }
  sendFancy(to, title, description) {
    let channel = this.getTo(to);
    const embed = new RichEmbed()
    // Set the title of the field
    .setTitle(title)
    // Set the color of the embed
    .setColor(0xff0000)
    // Set the main content of the embed
    .setDescription(description);
    channel.send(embed);
  }

  onMessage2(data) {
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
    let inputObject = new Input(input);
    //console.log("IO: ", inputObject);
    let commandPromises = [];
    //console.log("CoMMANDS: ",commandController.commands);
    for(var command in commandController.commands) {
      console.log("Trying command: ", command);
      try {
        //commandController.commands[command].evaluateMessage(input, this)
        commandPromises.push(commandController.commands[command].evaluateMessage(inputObject, this));
      }
      catch(err) {
        console.error(err);
      }
    }
    Promise.all(commandPromises).then(function(values) {
      //console.log("Promise Values",values);
      for(let v in values) {
        if(values.hasOwnProperty(v)) {
          // Loop all the answeres we got from different commands
          let promiseResult = values[v];

          for(let o in promiseResult) {
            if(promiseResult.hasOwnProperty(o) && promiseResult[o]) {
              // If an command gives multiple answers loop them too
              let answer = promiseResult[o];
              this.evaluateAnswer(answer);
            }
          }
        }
      }
    }.bind(this))
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

  playSound(audio, onEnd) {
    console.log("PLAY SOUND!",audio, onEnd);
    //console.log("Goto join a voicechannel!");
    //let channel = this.client.channels.find("name", this.voicechannel);
    //let channel = this.client.channels.get(this.voicechannel);
    //let channel = this.joinAudiochannel();
    //console.log(channel);
    this.stopDCTimer();
    let url;

    let play = function(audio) {
      let connection = this.voiceConnection;
      let dispatcher;

      if (typeof audio.pipe === "function") {
        // Audio is a stream

        dispatcher = connection.playStream(audio);
      }
      else if(typeof audio === "string") {
        url = audio;

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
          if(fs.existsSync("./audio/"+url)) {
            var readStream = fs.createReadStream("./audio/"+url);
            //console.log(this.voicechannel);
            dispatcher = connection.playStream(readStream);
          }
          else
          {
            console.log("Not on filesystem, try Request");
            dispatcher = connection.playStream(request(url));
          }
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
      play(audio);
    }
    else {
      this.joinAudiochannel(play.bind(this, audio));
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
          //console.log("Has member");
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
    //console.log("Channel: ",channel);
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
