import Command from '../command';
var Promise = require('promise');
import serviceController from '../serviceController';
import Link from '../LinkFactory';
import {findLinks} from '../lib';

class Test extends Command {

  constructor() {
    super();

    this.helpDescription = "Test Help";
    this.shortDescription= "TH";

    this.counter = 0;
  }

  evaluateMessage(input, service) {

    //console.log("service",service);
    var services = serviceController.getServices(service);

    var answers = [];
    var message = input.message;

    if(message == "test"){
      answers.push({"text": "EVAL IS Test: "+this.counter});
      this.counter++;
    }
    else if(message == "pokemon") {
      answers.push({"text": "Playing Pokémon", "audio": "102-palette_town_theme.mp3"});
    }
    else if(message == "dragonforce") {
      answers.push({"text": "Playing Dragon Force: Through the Fire and the Flames", "audio": "./Music/Dragon Force - Through the Fire and Flames.mp3"});
    }
    else if(message == "pentiums") {
      answers.push({"text": "Weird Al Yankovic - It's all about the Pentiums", "audio": "./Music/Weird Al Yankovic- All About The Pentiums.mp3"});
    }
    else if(message == "phone") {
      answers.push({"audio": "./Gmod\ Bananaphone.mp3"});
    }
    else if(message == "youtube") {
      service.playSound("http://youtube.com/watch?v=ZI-ol25RFws");
    }
    else if(message == "link") {
      console.log("Test download Link");
      console.log("LinkObject:",Link);
      let promise = Link.getDomFromURL("https://google.se");
      promise.then(res => {
          console.log("Result 1:",res);
      })
      console.log("Download it again");
      Link.getDomFromURL("https://google.se").then(res => {
          console.log("Result 2:",res);
      })
      answers.push({"text": "Downloading hardcoded link"})
    }

    var links = findLinks(message);
    for(var i in links) {
      if(links.hasOwnProperty(i)) {
        /*Link.getDomFromURL(links[i]).then(dom => {
          var meta = dom.window.document.querySelector("[name]").getAttribute("content");
          //console.log("META",meta);
          if(meta != null) {
            service.writeLine(input.to, ("Meta: "+meta));
          }
        });*/
      }
    }

    if(input.from == "tb") {
      answers.push({"text": "TB was here"});
    }

    for(var i in answers) {
      console.log(answers[i].text);
      if(service.writeLine && answers[i].text) {
        service.writeLine(input.to,answers[i].text);
      }
      if(service.playSound && answers[i].audio) {
        service.playSound(answers[i].audio, this.next);
      }
    }
  }
  evaluateFile(input) {
    return;
  }

  next() {
    console.log("Done");
  }
}
export default Test;
