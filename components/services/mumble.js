//const lame = require('lame');
import lame from "@schneefux/lame";
//const mumble = require( 'mumble' );
import NoodleJS from '@acupofjose/noodle';
//const fs = require('fs');
import fs from "fs";
//const streamy = require("youtube-audio-stream");
//import streamy from "youtube-audio-stream";
//const ytdl = require('ytdl-core');
import ytdl from "ytdl-core";
//const request = require("request");
import request from "request";
import {cleanURL, isYoutube} from "../lib.js";
import Service from '../classes/service.js';
import commandController from '../controllers/commandController.js';
import Input from '../classes/input.js';

class Mumble extends Service {
  constructor(hostConfig) {
    super(hostConfig);
    console.log("Loading Mumble");
    //console.log("Loading Mumble with config", hostConfig);
    this.name = "mumble";
    this.stream = null;
    this.volume = 0.05;
    //this.decode = null;

    this.sessions = {};

    let client = new NoodleJS.default(
      {
        url: hostConfig.mumble_url,
        name: hostConfig.name,
        tokens: [hostConfig.token]
      }
    );
    this.client = client;

    client.on('ready', this.onReady.bind(this));
    client.on( 'initialized', init => {console.log("Init!", init);});
    client.on( 'protocol-in', this.onDefault.bind(this));
    client.on( 'message', message => {
      console.log(message);
      //console.log("Channels: ", message.channels.get(0))
      //var user = this.sessions[data.sender];
      let user = message.sender;
      if(!user) return;
      console.log(user ? user.name : "?" + ' => ' + message.sender.channel.name + ': ' + message.content);
      var input = {
        "message": message.content,
        "from": {
          "username": user.name,
          "id": user.hash
        },
        "to": message.sender.channel.name
      };
      this.onMessage(new Input(input));
    });
    client.on( 'userState', state => {this.sessions[state.session] = state;});
    client.on( 'ChannelState', state => { console.log("State: ", state); });

    client.connect();
  }

  onReady(data) {

    console.log("Mumble Connected:", data.welcomeMessage);
    /*var list = this.client.users();
    for(var key in list) {
        var user = list[key];
        console.log("  - " + user.name + " in channel " + user.channel.name);
    }
    console.log("\nThose were all users!");*/
  }
  onDefault(data) {
    //console.log('event', data.handler, 'data', data.message);
  }

  evaluateAnswer(answer) {
    console.log("Answer: ",answer);
    console.log(this.name, answer.to ? answer.to.service : "No To");
    if(answer.to.service && answer.to.service.name !== this.name) {
      // Send this to this other service
      console.log("Send this to another service");
      answer.to.service.evaluateAnswer(answer);
    }
    else {
      if(answer.text) {
        this.writeLine(answer.to.recipient, answer.text);
      }
      if(answer.audio) {
        this.playSound(answer.audio);
      }
      if(answer.fancy) {
        this.sendFancy(answer.to.recipient, answer.fancy.title, answer.fancy.description);
      }
    }
  }

  writeLine(to, text) {
    //console.log(text);
    this.client.user.channel.sendMessage(text);
  }
  sendFancy(to, title, description) {
    this.client.user.channel.sendMessage('<h1>' + title + '</h1><span style="color: red;">' + description + '</span>');
  }

  stopSound() {
    if(this.stream != null) {
      this.stream.end();
      this.stream.unpipe();
      this.playing = false;
    }
  }

  playSound(url, onEnd) {
    //url = cleanURL(url);
    console.log("PlaySound URL", url);

    this.client.voiceConnection.stopStream();
    //var stream;
    //var decoder = new lame.Decoder();
    /*if(this.stream != null) {
      this.stream.end();
      this.stream.unpipe();
      //this.stream.close();
    }*/
    /*decoder.on('format', function( format ) {
        console.log( {format} );
        this.playing = true;
        this.client.voiceConnection.playStream(format);
        /*this.stream.pipe(this.client.inputStream({
              channels: format.channels,
              sampleRate: format.sampleRate,
              gain: this.volume
          })
        );* /
        console.log("Client Voiceconnection playStream");
        //this.client.voiceConnection.playStream(this.stream);
    }.bind(this));*/

    if(isYoutube(url)) {
      // Youtube Vid
      console.log("Youtube");
      //this.stream = streamy(url).pipe(decoder);
      //streamy(url).pipe(this.client.voiceConnection.playStream())

      //console.log(stream, typeof stream);
      //ytdl(url).pipe(decoder);
      this.client.voiceConnection.playStream(ytdl(url));
    }
    else
    {
      console.log("Checking audio folder");
      if(fs.existsSync("./audio/"+url)) {
        console.log("Audiofile found in folder, playing");
        //this.stream = fs.createReadStream("./audio/"+url).pipe(decoder);
        this.client.voiceConnection.playFile("./audio/"+url);
      }
      else
      {
        console.log("Not on filesystem, try Request");
        //this.stream = request(url).pipe(decoder);

        this.client.voiceConnection.playStream(url);
      }
    }

    /*try {
      //this.stream = streamy(url).pipe(decoder);
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
    }*/


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
}

export default Mumble;
