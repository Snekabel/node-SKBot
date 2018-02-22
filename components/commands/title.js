import Command from '../command';
var http = require('http');
const url = require('url');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var Promise = require('promise');
var async = require("async");

class Title extends Command {

  constructor() {
    super();

    this.helpDescription = "Test Help";
    this.shortDescription= "TH";

    console.log("Test Command Loaded");
  }

  evaluate(input, service) {
    var services = super.getServices(service);

      var start = (new Date).getTime();
      var message = input.message;

      //return answers;
      var links = [];

      var split = message.split(/\s+/);
      for(var i in split) {
        var word = split[i];
        //console.log("Word: ",word);
        if(word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
          var word = word.substring(word.indexOf("http://"));
          if(word.indexOf("\"") > -1)
          {
            word = word.substring(0, word.indexOf("\""));
          }
          //console.log("Website!",word);

          links.push(
            url.parse(word)
          );
        }
      }

      console.log("Links",links);
        for(var i in links) {
          JSDOM.fromURL.bind(this,links[i].href)().then(dom => {
            var title = dom.window.document.querySelector("title").innerHTML;
            console.log("Title:",title);
            if(title != null) {
              service.writeLine(input.to, ("Title: "+title));
            }
          });
        }

        /*async.each(links, function(item, callback){
        },
        function() {
          //console.log("Answers",answers);
          var stop = (new Date).getTime();
          //answers.push({"text": ("Time: "+(stop-start))})
          //fulfill(answers);
        });*/
  }
}
export default Title;
