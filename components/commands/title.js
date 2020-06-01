import Command from '../command';
import serviceController from '../serviceController';
import Link from '../LinkFactory';
import {findLinks} from '../lib';
import Answer from '../answer';

class Title extends Command {

  constructor() {
    super();

    this.helpDescription = "Title Help";
    this.shortDescription= "TH";
  }

  evaluateMessage(input, service) {
    var start = (new Date).getTime();
    var message = input.message;

    let promise = new Promise((resolve, reject) => {
      var links = findLinks(message);
      //console.log("Links: ",links);

      let linkPromises = [];
      for(var i in links) {
        if(links.hasOwnProperty(i)) {

          linkPromises.push(Link.getDomFromURL(links[i]).then(dom => {
            if(dom !== null) {
              var title = dom.window.document.querySelector("title").innerHTML;
              //console.log("Title:",title);
              if(title != null) {
                //service.writeLine(input.to, ("Title: "+title));
                return(new Answer(input.to, "Title: "+title))
              }
            }
            return;
          }));
        }
      }
      Promise.all(linkPromises).then(function(values) {
        //console.log("All Links Downloaded: ", values);
        resolve(values);
      }.bind(this));

    });

    return promise;

    //return answers;


      /*async.each(links, function(item, callback){
      },
      function() {
        //console.log("Answers",answers);
        var stop = (new Date).getTime();
        //answers.push({"text": ("Time: "+(stop-start))})
        //fulfill(answers);
      });*/
  }
  evaluateFile(link, file, input, service) {
    //console.log(file);
    let dom = file.content;
    /*var title = dom.window.document.querySelector("title").innerHTML;
    console.log("Title:",title);
    if(title != null) {
      service.writeLine(input.to, ("Title: "+title));
    }
    */
    var title = dom.window.document.querySelector("title").innerHTML;
    var price;

    console.log("W: ",link.href.indexOf("webhallen.com"));
    if(link.href.indexOf("webhallen.com") > -1) {
      console.log("Webhallen!");
      //price = dom.window.document.querySelector("#product_price").innerHTML;
      var pathname = link.href.split("/");
      var id = pathname[pathname.length-1].split("-")[0];

      /*if(data) {
        price = data.offer.price;
      }*/
    }

    if(title != null && title != "") {
      let lineToWrite = "Title: "+title;
      if(price) {
        lineToWrite += ", Price: "+price;
      }
      service.writeLine(input.to, lineToWrite);
    }
  }
}
export default Title;
