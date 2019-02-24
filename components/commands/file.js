import Command from '../command';
var http = require('http');
const url = require('url');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var Promise = require('promise');
var async = require("async");

class File extends Command {

  constructor(commandController, commandSettings) {
    super();

    this.helpDescription = "Downloads files linked to the bot and sends the content to other commands for parsing";
    this.shortDescription= "Downloads files linked to the bot.";
    this.cc = commandController;

    console.log("Settings: ",commandSettings);

  }

  evaluateMessage(input, service) {
    var message = input.message;

    var split = message.split(/\s+/);
    for(var i in split) {
      var word = split[i];

      this.ifToDownload(word);
      if(word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
        // File download from the Website

        word = this.cleanURL(word);


        let subWords = word.split(".");
        //console.log("File Ending?",subWords[subWords.length]);
        let link = url.parse(word);
        console.log("Website",link.href);

        JSDOM.fromURL.bind(this,link.href)().then(dom => {
          var file = {
            mime: "text/html",
            content: dom
          }
          for(let command in this.cc.commands) {
            //console.log("Command: ",command);
            if(this.cc.commands.hasOwnProperty(command)) {
              if(command != "file") {
                this.cc.commands[command].evaluateFile(link,file, input, service);
              }
            }
          }
        });
      }
    }
  }
  evaluateFile(input) {
    return;
  }

  cleanURL(dirtyURL) {
    var cleanURL = dirtyURL.substring(dirtyURL.indexOf("https://"));
    //console.log("Clean1: ", cleanURL);
    if(cleanURL.indexOf("\"") > -1)
    {
      cleanURL = cleanURL.substring(0, cleanURL.indexOf("\""));
    }
    //console.log("Clean2: ", cleanURL);
    return cleanURL;
  }

  ifToDownload(word) {
    if(word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
      let link = url.parse(this.cleanURL(word));

      console.log(link)
      // When to not Download

    }
  }

  /*
  Url {
  protocol: 'https:',
  slashes: true,
  auth: null,
  host: 'www.webhallen.com',
  port: null,
  hostname: 'www.webhallen.com',
  hash: null,
  search: null,
  query: null,
  pathname: '/se/product/289833-Red-Dead-Redemption-2-Ultimate-Edition',
  path: '/se/product/289833-Red-Dead-Redemption-2-Ultimate-Edition',
  href:
   'https://www.webhallen.com/se/product/289833-Red-Dead-Redemption-2-Ultimate-Edition' }
   */
}
export default File;
