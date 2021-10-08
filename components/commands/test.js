import Command from '../classes/command.js';
import serviceController from '../controllers/serviceController.js';
import Link from '../LinkFactory.js';
import Answer from '../classes/answer.js';

export default class Test extends Command {

  constructor(settings,sliceKey) {
    super(settings,sliceKey);
    this.helpDescription = "Test Help";
    this.shortDescription= "TH";
    this.commands = {
      "test": {
        "desc": "For testing",
        "func": this.test.bind(this)
      },
      "pokemon": {
        "desc": "Playing Palet Town Theme",
        "func": function(input) {return new Answer(input.to,"Playing Pokémon","102-palette_town_theme.mp3")}
      },
      "youtube": {
        "desc": "Testplay the youtube vid in audiochannel",
        "func": function(input) {return new Answer(input.to).setAudio("http://youtube.com/watch?v=ZI-ol25RFws")}
      },
      "audiotest": {
        "desc": "Testplay the mp3 in audiochannel",
        "func": function(input) {return new Answer(input.to).setAudio("http://tb.snekabel.se/files/Blaa.mp3")}
      },
      "Gundako": {
        "desc": "Showing an image",
        "func": function(input) {return new Answer(input.to).setImage("Gundako.png");}
      },
      "FancyTest": {
        "desc": "Testing fancy text",
        "func": function(input, service) {return new Answer(input.to).setFancy({"title": "Fancy Title", "description": "Very fancy description, don't you think?"});}
      },
      "link": {
        "desc": "Test downloading predefined link",
        "func": this.linkTest.bind(this)
      }
    }

    this.triggers = {
      "testin": {
        "desc": "Whenever someone writes testin' somewhere bot responds",
        "func": function(input) {return new Answer(input.to, "So you are testin' eh...")}
      },
      "cross": {
        "desc": "Crosstalk test with other services",
        "func": this.crossTest.bind(this)
      }
    }

    this.counter = 0;
    console.log("Loaded Test");
  }

  evaluateMessage(input, service) {
    //console.log("Eval Input: ", input);
    return super.evaluateMessage(input,service);
  }

  test(input) {
    console.log("TESTING THE NEW THING", this.counter);
    let a = new Answer(input.to,"EVAL IS Test: "+this.counter);
    this.counter++;
    return a;
  }
  linkTest(input) {
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
    return new Answer(input.to,"Downloading hardcoded link");
  }
  crossTest(input,service) {
    let recipient = "";
    if(service.name === "IRC") {
      recipient = "skbot";
    } else if(service.name === "Discord") {
      recipient = "#snekabel"
    }

    return new Answer(null, "Cross Service message: " + message.substring(5)).setTo(recipient, services[0]);
  }

  evaluateFile(input) {
    return;
  }

  next() {
    console.log("Done");
  }
}
