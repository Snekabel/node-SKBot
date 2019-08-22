import Command from '../command';
import serviceController from '../serviceController';

class Title extends Command {

  constructor() {
    super();

    this.helpDescription = "Title Help";
    this.shortDescription= "TH";
  }

  evaluateMessage(input, service) {
    return null;
    /*var services = super.getServices(service);

    var start = (new Date).getTime();
    var message = input.message;

    //return answers;
    var links = [];

    var split = message.split(/\s+/);
    for(var i in split) {
      var word = split[i];
      console.log("Word: ",word);
      if(word.indexOf("http://") > -1 || word.indexOf("https://") > -1) {
        /*var word = word.substring((word.indexOf("http://")||word.indexOf("https://")));
        if(word.indexOf("\"") > -1)
        {
          word = word.substring(0, word.indexOf("\""));
        }
        word = this.cleanURL(word);
        console.log("Website!",word);

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
      }*/

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
