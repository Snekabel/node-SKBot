import * as sdk from "matrix-js-sdk";
import fs from "fs";
import ytdl from "ytdl-core";
import request from "request";
//const SoundCloud = require('soundcloud-api-client');
import {cleanURL, isYoutube} from "../lib.js";
import Service from '../classes/service.js';
import Input from '../classes/input.js';
import commandController from '../controllers/commandController.js';


class Matrix extends Service {
  constructor(hostConfig) {
    //console.log(cleanURL, isYoutube);
    super(hostConfig);
    this.name = "Matrix";
    //console.log("Loading Discord with config", hostConfig);
    this.stream = null;
    //this.volume = 0.05;
    //this.decode = null;

    this.sessions = {};

    //console.log(sdk.default);
    /*const client = sdk.default.createClient(
      hostConfig.hostname,
      hostConfig.accessToken,
      hostConfig.user_id
    );*/
    const client = sdk.default.createClient({
      baseUrl: hostConfig.hostname,
      accessToken: hostConfig.access_token,
      userId: hostConfig.user_id
    });
    this.client = client;
    //client.start().then(() => console.log("Client started!"));
    //this.status();

    client.on("sync", (state, prevState, data) => {
        switch (state) {
            case "PREPARED":
            //console.log("PREPARED: ", state, data);
              this.setRoomList();
              this.setUser(data);
              this.clearEvents();
              this.test();
              //printRoomList();
              //printHelp();
              //rl.prompt();
            break;
       }
    });
    client.on("event", (event) => {
      console.log("Event Recived: ", event);
    });
    client.on("room.message", (event, room, poop) => {
      console.log("Event: ", event, room, poop);
    });


    /*const content = {
    "body": "Testing",
    "msgtype": "m.text"
    };
    client.sendEvent("#chat:matrix.snekabel.se", "m.room.message", content, "", (err, res) => {
        console.log(err);
    });*/
    //'!NMHowLhhlaFfAllTvu:matrix.snekabel.se'

    /*client.loginWithPassword(hostConfig.username, hostConfig.password, (error, response) => {
      console.log(error, response);
      this.accessToken = response.access_token;
    })*/

    this.voicechannel = hostConfig.voicechannel;

    this.lastInput = null;

    this.channel;
    this.voiceConnection;

    this.DCTimer;
    this.roomList = [];

    /*client.on('ready', () => {
      this.onReady();

      let user = this.client.user;
    });*/

    //this.soundcloud = new SoundCloud('394087696');


    /*client.on("Room.timeline", function(event, room, toStartOfTimeline) {
      console.log("hhhh", event, room, toStartOfTimeline);
      if (event.getType() !== "m.room.message") {
        return; // only use messages
      }
      console.log("YOU GOT MAIL: ",event.event.content.body);
    });*/



    /*client.publicRooms(function(err, data) {
      console.log("Public Rooms: %s", JSON.stringify(data));
    });*/
    //
    client.startClient();
  }

  setUser(data) {
    //this.user = state.client.user;
  }

  ready() {
    this.client.on("Room.timeline", (event, room, toStartOfTimeline) => {
      event.setStatus("not_sent");
      if (toStartOfTimeline) {
          return; // don't print paginated results
      }
      if (event.getType() !== "m.room.message") {
           return; // only print messages
       }
      if(event.event.sender === this.hostConfig.user_id) {
        return; // Ignore messages by the bot
      }

      let name = event.sender ? event.sender.name : event.getSender();
      var time = new Date(
        event.getTs()
      ).toISOString().replace(/T/, ' ').replace(/\..+/, '');
      console.log("%s - %s: %s",time,name, event.event.content.body);

      console.log(event.sender);
      var input = {
        "message": event.event.content.body,
        "from": {
          "username": name,
          "id": event.sender.userId
        },
        "to": room.roomId
      };
      let inputObject = new Input(input);
      //console.log("Input Object: ", inputObject);
      this.onMessage(inputObject);
      /*let line = "Fuck yeah testin!";
      this.client.sendTextMessage(room.roomId, line).finally(function() {

      });*/

      //this.client.sendImageMessage(room.roomId, "https://avt.mkklcdnv6temp.com/17/p/17-1583495892.jpg", {}, "TestImg").then(res=>console.log(res))
    });
    this.client.on("RoomMember.membership", (event, room)=>{
      console.log("Invite or something?",event);
      //this.checkJoinRoom(event.target);
    })
  }

  setRoomList() {
    this.roomList = this.client.getRooms();
    //console.log("RoomList: ", this.roomList);
    for(let r in this.roomList) {
      if(this.roomList.hasOwnProperty(r)) {
        let room = this.roomList[r];

        this.checkJoinRoom(room);
      }
    }
    /*roomList.sort(function(a,b) {
        // < 0 = a comes first (lower index) - we want high indexes = newer
        var aMsg = a.timeline[a.timeline.length-1];
        if (!aMsg) {
            return -1;
        }
        var bMsg = b.timeline[b.timeline.length-1];
        if (!bMsg) {
            return 1;
        }
        if (aMsg.getTs() > bMsg.getTs()) {
            return 1;
        }
        else if (aMsg.getTs() < bMsg.getTs()) {
            return -1;
        }
        return 0;
    });*/
}
  checkJoinRoom(room) {
  if(room.getMember(this.hostConfig.user_id).membership === "invite") {
    this.client.joinRoom(room.roomId).then(function(res) {
      console.log("Join Room Res: ", res);
      //setRoomList();
      //viewingRoom = room;
      //printMessages();
      //rl.prompt();
    }, function(err) {
        print("/join Error: %s", err);
    });
  }
  }
  test() {
    this.client.sendImageMessage("!NMHowLhhlaFfAllTvu:matrix.snekabel.se", "http://tb.snekabel.se/art/pixelart/Luffy.png", {}, "TestImg").then(res=>console.log(res))
  }
  clearEvents() {

  }

  status() {
    console.log("CHecking Status");
    this.client.once('sync', function(state, prevState, res) {
      if(state === 'PREPARED') {
          console.log("prepared");
      } else {
          console.log(state);
          process.exit(1);
      }
    });
  }

  quit(reason) {
    console.log("Matrix stopped...");
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
    //let channel = this.getTo(to);
    //channel.send(text);
    //this.client.user.channel.sendMessage(text);
    this.client.sendTextMessage(to, text).finally(function() {

    });
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

}

export default Matrix;
