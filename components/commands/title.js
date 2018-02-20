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

  evaluate(input) {
    //var answers = [];
    return new Promise(function (fulfill, reject){
      var start = (new Date).getTime();

      //return answers;
      var links = [];

      var split = input.split(/\s+/);
      for(var i in split) {
        var word = split[i];
        //console.log("Word: ",word);
        if(word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
          var word = word.substring(word.indexOf("http://"));
          if(word.indexOf("\"") > -1)
          {
            word = word.substring(0, word.indexOf("\""));
          }
          console.log("Website!",word);

          links.push(
            url.parse(word)
          );
        }
      }
      if(links.length == 0) {
        reject();
      }
      else {
        console.log("Links",links);
          var answers = [];
          async.each(links, function(item, callback){
            JSDOM.fromURL.bind(this,item.href)().then(dom => {
              var title = dom.window.document.querySelector("title").innerHTML;
              console.log("Title:",title);
              if(title != null) {
                //callback(null, {"text":title});
                answers.push({"text":title});
                callback();
              }
              else {
                //callback("No title",null);
                callback();
              }
            });
          },
          function() {
            console.log("Answers",answers);
            var stop = (new Date).getTime();
            answers.push({"text": ("Time: "+(stop-start))})
            fulfill(answers);
          });

          /*
          var jobs = [];
          for(var i in links) {
            var link = links[i];
            //console.log("Link: ",link);
            jobs.push(
              function (callback) {
                if(link.href != null) {
                  JSDOM.fromURL.bind(this,link.href)().then(dom => {
                    var title = dom.window.document.querySelector("title").innerHTML;
                    console.log("Title:",title);
                    if(title != null) {
                      callback(null, {"text":title});
                    }
                    else {
                      callback("No title",null);
                    }
                  });

                  callback(null, link.href);
                }
                else {
                  callback("No href",null);
                }
              }
              //.bind(this,link)
            );
          }*/
          //console.log("We got some links");
          //reject();
          /*async.series(jobs, function (err, allresults) {
            if(err) {
              reject();
            }
            fulfill(allresults);
            //console.log("all Results",allresults);
            for(var i in allresults) {
              //console.log(allresults[i]);
            }
          });*/
      }
    });
  }
}
export default Title;
