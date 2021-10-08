import ChatClient from 'twitch-chat-client';
const fs = require('fs');
const ytdl = require('ytdl-core');
const request = require("request");
const {cleanURL, isYoutube} = require("../lib");
import Service from '../classes/service.js';
import commandController from '../controllers/commandController.js';

class Twitch extends Service {
  constructor(hostConfig) {
    super(hostConfig);
    console.log("Loading Twitch");
    //console.log("Loading Mumble with config", hostConfig);
    this.name = "Twitch";
    this.sessions = {};

    this.chatClient;

    this.init();
  }

  init() {
    this.chatClient = await ChatClient.forTwitchClient(twitchClient);
    this.chatClient.onRegister(() => chatClient.join('cottoncandypet'));
    console.log("Listening to chat");
    // listen to more events...
    await chatClient.connect();
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
    }
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
    //url = cleanURL(url);
    console.log("PlaySound URL", url);
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

    if(isYoutube(url)) {
      // Youtube Vid
      console.log("Youtube");
      this.stream = streamy(url).pipe(decoder);
    }
    else
    {
      console.log("Checking audio folder");
      if(fs.existsSync("./audio/"+url)) {
        console.log("Audiofile found in folder, playing");
        this.stream = fs.createReadStream("./audio/"+url).pipe(decoder);
      }
      else
      {
        console.log("Not on filesystem, try Request");
        this.stream = request(url).pipe(decoder);
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

  onMessage(data) {
    console.log(data);
    var user = this.sessions[data.actor];
    console.log(user.name + ':', data.message);
    var input = {
      "message": data.message,
      "from": {
        "username": user.name,
        "id": user.id
      },
      "to": true
    };
    /*for(var command in this.cc.commands) {
      try {
        this.cc.commands[command].evaluateMessage(input, this)
      }
      catch(err) {
        console.error(err);
      }
    }*/
    /*this.cc.commands[command].evaluateMessage(data.message).done(function(answers){
      for(var answer in answers) {
        if(answers[answer].audio != null) {
          this.play.bind(this, client, answers[answer].audio)();
        }
        client.user.channel.sendMessage(answers[answer].text);
      }
    }, function(reject) {console.log("Rejected")});*/

    let commandPromises = [];
    for(var command in commandController.commands) {
      try {
        //commandController.commands[command].evaluateMessage(input, this)
        commandPromises.push(commandController.commands[command].evaluateMessage(input, this));
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
