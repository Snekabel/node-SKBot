import Command from '../command';
var Promise = require('promise');
import serviceController from '../serviceController';
import Link from '../LinkFactory';
import {findLinks} from '../lib';
import Answer from '../answer';

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

    let promise = new Promise((resolve, reject) => {

      switch(message) {
        case "test": {
          answers.push(new Answer(input.to,"EVAL IS Test: "+this.counter));
          this.counter++;
          break;
        }
        case "pokemon": {
          answers.push(new Answer(input.to,"Playing Pokémon","102-palette_town_theme.mp3"));
          break;
        }
        case "dragonforce": {
          answers.push(new Answer(input.to,"Playing Dragon Force: Through the Fire and the Flames", "./Music/Dragon Force - Through the Fire and Flames.mp3"));
          break;
        }
        case "pentiums": {
          answers.push(new Answer(input.to,"Weird Al Yankovic - It's all about the Pentiums","./Music/Weird Al Yankovic- All About The Pentiums.mp3"));
          break;
        }
        case "phone": {
          answers.push(new Answer(input.to,"./Gmod\ Bananaphone.mp3"));
          break;
        }
        case "youtube": {
          let answer = new Answer(input.to);
          answer.setAudio("http://youtube.com/watch?v=ZI-ol25RFws");
          answers.push(answer);
          //service.playSound("http://youtube.com/watch?v=ZI-ol25RFws");
          break;
        }
        case "link": {
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
          answers.push({"to": input.to,"text": "Downloading hardcoded link"})
          break;
        }
      }

      if(input.from == "tb") {
        answers.push({"to": input.to,"text": "TB was here"});
      }

      resolve(answers);
    })

    return promise;
    /*for(var i in answers) {
      console.log(answers[i].text);
      if(service.writeLine && answers[i].text) {
        service.writeLine(input.to,answers[i].text);
      }
      if(service.playSound && answers[i].audio) {
        service.playSound(answers[i].audio, this.next);
      }
    }*/
  }

  evaluateFile(input) {
    return;
  }

  next() {
    console.log("Done");
  }
}
export default Test;
