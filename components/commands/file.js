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
    this.settings = commandSettings;

  }

  evaluateMessage(input, service) {
    var message = input.message;

    var split = message.split(/\s+/);
    for(var i in split) {
      var word = split[i];

      this.ifToDownload(word, input, service);
      /*if(word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
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
      */
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

  ifToDownload(word, input, service) {
    if(word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
      let link = url.parse(this.cleanURL(word));

      console.log(link)
      // When to not Download
      if(this.settings.domainBlacklist.includes(link.host)) {
        return false;
      }

      let subWords = link.path.split(".");
      let fileending = subWords[subWords.length-1];

      if(link.path.indexOf(".") > -1 && fileending && fileending != "") {
        console.log("Fileending: ",fileending);
        switch(fileending) {
          case "php":
          case "html":
            this.howToDownload(link, fileending, true, input, service);
            break;
          default:
            console.log("Unsure fileending");
            return false;
            // If anything else don't download
        }
      }
      else
      {
        console.log("If no filenending we gonna try downloading it");
        // If no fileending we goto try to download to see what we get!
        this.howToDownload(link, fileending, false, input, service);
      }

    }
  }

  whatToDownload(link, fileending, input, service) {
      return false;
  }

  howToDownload(link, fileending, isWebsite, input, service) {
    if(isWebsite) {
      console.log("Probably a website");
      // Probably a website
      // Download an parse as html
      this.downloadAsWebsite(link, input, service);
    }
    else {
      console.log("Maybe a website");
      // Maybe a website
      // Download, check if possible HTML, if then parse into a DOM
      this.downloadAsWebsite(link, input, service);
    }
  }

  downloadAsWebsite(link, input, service) {
    console.log("Download as Website");
    JSDOM.fromURL.bind(this,link.href)().then(dom => {
      var file = {
        link: link,
        mime: "text/html",
        content: dom
      }
      this.callCommands(link, file, input, service);
    });
  }

  callCommands(link, file, input, service) {
    for(let command in this.cc.commands) {
      //console.log("Command: ",command);
      if(this.cc.commands.hasOwnProperty(command)) {
        if(command != "file") {
          this.cc.commands[command].evaluateFile(link, file, input, service);
        }
      }
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
